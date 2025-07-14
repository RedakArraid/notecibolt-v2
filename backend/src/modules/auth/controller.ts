import { Request, Response } from 'express';
import { authService } from './service';
import { asyncHandler } from '../../shared/middleware/errorHandler';
import { AuthRequest } from '../../shared/middleware/authMiddleware';

class AuthController {
  // Connexion
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;
    
    const result = await authService.login(email, password, rememberMe);
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: result
    });
  });

  // Inscription
  register = asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;
    
    const result = await authService.register(userData);
    
    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès. Veuillez vérifier votre email.',
      data: result
    });
  });

  // Déconnexion
  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await authService.logout(token);
    }
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  });

  // Rafraîchir le token
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    
    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      message: 'Token rafraîchi avec succès',
      data: result
    });
  });

  // Mot de passe oublié
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    
    await authService.forgotPassword(email);
    
    res.json({
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
    });
  });

  // Réinitialiser le mot de passe
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    
    await authService.resetPassword(token, newPassword);
    
    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  });

  // Vérifier l'email
  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    
    await authService.verifyEmail(token);
    
    res.json({
      success: true,
      message: 'Email vérifié avec succès'
    });
  });

  // Renvoyer l'email de vérification
  resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    
    await authService.resendVerification(email);
    
    res.json({
      success: true,
      message: 'Email de vérification renvoyé'
    });
  });

  // Obtenir l'utilisateur actuel
  getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    const userDetails = await authService.getCurrentUser(req.user.id);
    
    res.json({
      success: true,
      data: userDetails
    });
  });
}

export const authController = new AuthController();
