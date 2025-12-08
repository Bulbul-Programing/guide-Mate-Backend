import express from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { UserValidationSchema } from './validationSchema';
import verifyToken from '../../middleware/verifyToken';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:userId', verifyToken("ADMIN", 'GUIDE', "TRAVELER"), userController.getSingleUser);
router.post('/create', validateRequest(UserValidationSchema.createUserSchema), userController.createUser)
router.put('/update/guide-profile/:userId', verifyToken('GUIDE'), validateRequest(UserValidationSchema.GuideProfileUpdateSchema), userController.updateGuideProfile);
router.put('/update/:userId', verifyToken("ADMIN", 'GUIDE', "TRAVELER"), validateRequest(UserValidationSchema.updateUserSchema), userController.updateUser);
router.delete('/delete/:userId', userController.deleteUser);

export const userRoutes = router;