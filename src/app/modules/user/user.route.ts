import express from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { UserValidationSchema } from './validationSchema';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/create', validateRequest(UserValidationSchema.createUserSchema), userController.createUser)
router.put('/guide-profile/:userId', validateRequest(UserValidationSchema.GuideProfileSchema), userController.updateGuideProfile);
router.put('/:userId', validateRequest(UserValidationSchema.updateUserSchema), userController.updateUser);

export const userRoutes = router;