import express from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { UserValidationSchema } from './validationSchema';

const router = express.Router();

router.post('/create', validateRequest(UserValidationSchema.createUserSchema), userController.createPatient)

export const userRoutes = router;