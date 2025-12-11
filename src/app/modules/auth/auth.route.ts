import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';
import verifyToken from '../../middleware/verifyToken';

const router = express.Router();

router.post('/login', validateRequest(authValidation.loginValidationSchema), authController.loginUser)
router.get('/me', verifyToken('ADMIN', 'GUIDE', 'TRAVELER'), authController.getMe)
router.put('/change-password', verifyToken('ADMIN', 'GUIDE', 'TRAVELER'), validateRequest(authValidation.updatePasswordSchema), authController.changePassword)

export const authRoutes = router;