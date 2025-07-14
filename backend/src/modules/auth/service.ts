import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { config } from '../../config';
import { errors } from '../../shared/middleware/errorHandler';
import { emailService } from '../../shared/utils/emailService';
import { CreateUserData, LoginResponse, UserWithDetails } from './types';

const prisma = new PrismaClient();

class AuthService {
  // Connexion
  async login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        student: true,
        teacher: true,
        parent: true,
        admin: true,
      }
    });

    if (!user) {
      throw errors.unauthorized('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw errors.unauthorized('Compte désactivé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw errors.unauthorized('Email ou mot de passe incorrect');
    }

    // Générer les tokens
    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // Sauvegarder la session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000), // 30 jours si "se souvenir", sinon 7 jours
      }
    });

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: rememberMe ? '30d' : '7d',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        emailVerifiedAt: user.emailVerifiedAt,
      }
    };
  }

  // Inscription
  async register(userData: CreateUserData): Promise<{ user: any; message: string }> {
    const { email, password, name, role, ...additionalData } = userData;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw errors.conflict('Un compte avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

    // Créer l'utilisateur dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur de base
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role,
          avatar: additionalData.avatar,
          phone: additionalData.phone,
          address: additionalData.address,
          dateOfBirth: additionalData.dateOfBirth ? new Date(additionalData.dateOfBirth) : undefined,
        }
      });

      // Créer les données spécifiques selon le rôle
      switch (role) {
        case 'STUDENT':
          await tx.student.create({
            data: {
              userId: user.id,
              studentId: `STU${Date.now()}`,
              parentIds: additionalData.parentIds || [],
              admissionDate: new Date(),
              academicYear: config.academicYear,
              allergies: additionalData.allergies || [],
              medications: additionalData.medications || [],
              emergencyMedicalContact: additionalData.emergencyMedicalContact,
            }
          });
          break;

        case 'TEACHER':
          await tx.teacher.create({
            data: {
              userId: user.id,
              employeeId: `TEA${Date.now()}`,
              department: additionalData.department || 'Non spécifié',
              qualifications: additionalData.qualifications || [],
              hireDate: new Date(),
            }
          });
          break;

        case 'PARENT':
          await tx.parent.create({
            data: {
              userId: user.id,
              occupation: additionalData.occupation,
              preferredContactMethod: additionalData.preferredContactMethod || 'EMAIL',
            }
          });
          break;

        case 'ADMIN':
          await tx.admin.create({
            data: {
              userId: user.id,
              permissions: additionalData.permissions || [],
            }
          });
          break;
      }

      return user;
    });

    // Envoyer l'email de vérification
    await this.sendVerificationEmail(result.email, result.name);

    return {
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
      },
      message: 'Compte créé avec succès. Veuillez vérifier votre email.'
    };
  }

  // Déconnexion
  async logout(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      
      // Supprimer toutes les sessions de l'utilisateur
      await prisma.userSession.deleteMany({
        where: { userId: decoded.userId }
      });
    } catch (error) {
      // Ignorer les erreurs de token invalide lors de la déconnexion
    }
  }

  // Rafraîchir le token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
      
      // Vérifier que la session existe
      const session = await prisma.userSession.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          expiresAt: { gt: new Date() }
        },
        include: { user: true }
      });

      if (!session || !session.user.isActive) {
        throw errors.unauthorized('Session invalide');
      }

      // Générer de nouveaux tokens
      const newAccessToken = this.generateAccessToken(session.userId, session.user.role);
      const newRefreshToken = this.generateRefreshToken(session.userId);

      // Mettre à jour la session
      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
        }
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw errors.unauthorized('Token de rafraîchissement invalide');
    }
  }

  // Mot de passe oublié
  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return;
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Sauvegarder le token (vous pourriez vouloir créer une table séparée pour cela)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Vous devrez ajouter ces champs au modèle User
        // resetPasswordToken: hashedToken,
        // resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    });

    // Envoyer l'email de réinitialisation
    await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
  }

  // Réinitialiser le mot de passe
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Trouver l'utilisateur avec le token valide
    const user = await prisma.user.findFirst({
      where: {
        // resetPasswordToken: hashedToken,
        // resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!user) {
      throw errors.badRequest('Token invalide ou expiré');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, config.bcryptRounds);

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        // resetPasswordToken: null,
        // resetPasswordExpires: null
      }
    });

    // Supprimer toutes les sessions existantes
    await prisma.userSession.deleteMany({
      where: { userId: user.id }
    });
  }

  // Vérifier l'email
  async verifyEmail(token: string): Promise<void> {
    // Décoder le token de vérification
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { emailVerifiedAt: new Date() }
      });
    } catch (error) {
      throw errors.badRequest('Token de vérification invalide');
    }
  }

  // Renvoyer l'email de vérification
  async resendVerification(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return; // Ne pas révéler si l'email existe
    }

    if (user.emailVerifiedAt) {
      throw errors.badRequest('Email déjà vérifié');
    }

    await this.sendVerificationEmail(user.email, user.name);
  }

  // Obtenir l'utilisateur actuel avec tous les détails
  async getCurrentUser(userId: string): Promise<UserWithDetails> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            class: true,
            parents: { include: { user: true } }
          }
        },
        teacher: {
          include: {
            subjects: { include: { subject: true } },
            classes: { include: { class: true } }
          }
        },
        parent: {
          include: {
            children: { include: { user: true, class: true } }
          }
        },
        admin: true,
      }
    });

    if (!user) {
      throw errors.notFound('Utilisateur');
    }

    return user;
  }

  // Méthodes utilitaires privées
  private generateAccessToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn }
    );
  }

  private async sendVerificationEmail(email: string, name: string): Promise<void> {
    const verificationToken = jwt.sign(
      { email },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    await emailService.sendVerificationEmail(email, name, verificationToken);
  }
}

export const authService = new AuthService();
