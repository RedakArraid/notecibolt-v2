import nodemailer from 'nodemailer';
import { config } from '../../config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.emailConfig.host,
      port: config.emailConfig.port,
      secure: config.emailConfig.port === 465, // true pour 465, false pour les autres ports
      auth: {
        user: config.emailConfig.user,
        pass: config.emailConfig.password,
      },
      tls: {
        rejectUnauthorized: false // Accepter les certificats auto-signés en développement
      }
    });

    // Vérifier la configuration au démarrage
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ Service email configuré avec succès');
    } catch (error) {
      console.error('❌ Erreur de configuration email:', error);
    }
  }

  // Email de bienvenue et vérification
  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: config.emailConfig.from,
      to: email,
      subject: `${config.schoolName} - Vérifiez votre adresse email`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${config.schoolName}</h1>
              <p>Bienvenue dans votre espace éducatif</p>
            </div>
            <div class="content">
              <h2>Bonjour ${name},</h2>
              <p>Merci de vous être inscrit(e) sur ${config.schoolName}. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Vérifier mon email</a>
              </div>
              
              <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p><strong>Ce lien expire dans 24 heures.</strong></p>
              
              <p>Si vous n'avez pas créé de compte sur ${config.schoolName}, vous pouvez ignorer cet email.</p>
            </div>
            <div class="footer">
              <p>${config.schoolName}<br>
              ${config.schoolAddress}<br>
              ${config.schoolPhone} | ${config.schoolEmail}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Email de réinitialisation de mot de passe
  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: config.emailConfig.from,
      to: email,
      subject: `${config.schoolName} - Réinitialisation de votre mot de passe`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${config.schoolName}</h1>
              <p>Réinitialisation de mot de passe</p>
            </div>
            <div class="content">
              <h2>Bonjour ${name},</h2>
              <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte ${config.schoolName}.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              </div>
              
              <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Important :</strong>
                <ul>
                  <li>Ce lien expire dans 10 minutes</li>
                  <li>Il ne peut être utilisé qu'une seule fois</li>
                  <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                </ul>
              </div>
              
              <p>Pour votre sécurité, assurez-vous de choisir un mot de passe fort contenant au moins 8 caractères avec des majuscules, minuscules et chiffres.</p>
            </div>
            <div class="footer">
              <p>${config.schoolName}<br>
              ${config.schoolAddress}<br>
              ${config.schoolPhone} | ${config.schoolEmail}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Email de notification aux parents
  async sendParentNotification(
    parentEmail: string, 
    parentName: string, 
    studentName: string, 
    subject: string, 
    message: string,
    type: 'info' | 'warning' | 'success' = 'info'
  ): Promise<void> {
    const colors = {
      info: '#3498db',
      warning: '#f39c12',
      success: '#27ae60'
    };

    const mailOptions = {
      from: config.emailConfig.from,
      to: parentEmail,
      subject: `${config.schoolName} - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: ${colors[type]}; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .student-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${colors[type]}; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${config.schoolName}</h1>
              <p>${subject}</p>
            </div>
            <div class="content">
              <h2>Bonjour ${parentName},</h2>
              
              <div class="student-info">
                <strong>Concernant :</strong> ${studentName}
              </div>
              
              <div style="line-height: 1.6;">
                ${message}
              </div>
              
              <p>Pour plus d'informations, n'hésitez pas à nous contacter ou à consulter l'espace parent sur notre plateforme.</p>
              
              <p>Cordialement,<br>L'équipe pédagogique</p>
            </div>
            <div class="footer">
              <p>${config.schoolName}<br>
              ${config.schoolAddress}<br>
              ${config.schoolPhone} | ${config.schoolEmail}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Email de notification générale
  async sendGeneralNotification(
    emails: string[], 
    subject: string, 
    message: string,
    type: 'announcement' | 'urgent' | 'info' = 'info'
  ): Promise<void> {
    const colors = {
      announcement: '#9b59b6',
      urgent: '#e74c3c',
      info: '#3498db'
    };

    const mailOptions = {
      from: config.emailConfig.from,
      bcc: emails, // Utiliser BCC pour protéger la confidentialité
      subject: `${config.schoolName} - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: ${colors[type]}; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${config.schoolName}</h1>
              <p>${subject}</p>
            </div>
            <div class="content">
              <div style="line-height: 1.6;">
                ${message}
              </div>
              
              <p>Cordialement,<br>L'administration</p>
            </div>
            <div class="footer">
              <p>${config.schoolName}<br>
              ${config.schoolAddress}<br>
              ${config.schoolPhone} | ${config.schoolEmail}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Email de rapport hebdomadaire pour les parents
  async sendWeeklyReport(
    parentEmail: string,
    parentName: string,
    studentName: string,
    reportData: {
      grades: any[];
      attendance: any;
      assignments: any[];
      behavior: any[];
    }
  ): Promise<void> {
    const mailOptions = {
      from: config.emailConfig.from,
      to: parentEmail,
      subject: `${config.schoolName} - Rapport hebdomadaire de ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .grade-item { padding: 10px; border-bottom: 1px solid #eee; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${config.schoolName}</h1>
              <p>Rapport hebdomadaire</p>
            </div>
            <div class="content">
              <h2>Bonjour ${parentName},</h2>
              <p>Voici le rapport hebdomadaire de ${studentName} :</p>
              
              <div class="section">
                <h3>📊 Nouvelles notes</h3>
                ${reportData.grades.length > 0 ? 
                  reportData.grades.map(grade => `
                    <div class="grade-item">
                      <strong>${grade.subject}</strong>: ${grade.value}/${grade.maxValue}
                      <br><small>${grade.comment || ''}</small>
                    </div>
                  `).join('') : 
                  '<p>Aucune nouvelle note cette semaine.</p>'
                }
              </div>
              
              <div class="section">
                <h3>📅 Présences</h3>
                <p>Jours présents: ${reportData.attendance.present}</p>
                <p>Absences: ${reportData.attendance.absent}</p>
                <p>Retards: ${reportData.attendance.late}</p>
              </div>
              
              <div class="section">
                <h3>📝 Devoirs à venir</h3>
                ${reportData.assignments.length > 0 ? 
                  reportData.assignments.map(assignment => `
                    <div class="grade-item">
                      <strong>${assignment.title}</strong> (${assignment.subject})
                      <br><small>À rendre le: ${new Date(assignment.dueDate).toLocaleDateString('fr-FR')}</small>
                    </div>
                  `).join('') : 
                  '<p>Aucun devoir à venir.</p>'
                }
              </div>
              
              <p>Pour plus de détails, consultez l'espace parent sur notre plateforme.</p>
            </div>
            <div class="footer">
              <p>${config.schoolName}<br>
              ${config.schoolAddress}<br>
              ${config.schoolPhone} | ${config.schoolEmail}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
