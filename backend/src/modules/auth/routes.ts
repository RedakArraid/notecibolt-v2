import { Router } from 'express';
import { authController } from './controller';
import { validateRequest } from '../../shared/middleware/validateRequest';
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  refreshTokenSchema 
} from './validation';

const router = Router();

// Routes d'authentification
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/logout', authController.logout);
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshToken);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

// Route pour vérifier le token
router.get('/me', authController.getCurrentUser);

export default router;
