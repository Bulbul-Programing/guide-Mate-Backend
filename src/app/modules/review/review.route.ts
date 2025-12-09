import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { reviewValidationSchema } from './review.validation';
import { reviewController } from './review.controller';
import verifyToken from '../../middleware/verifyToken';

const router = express.Router()

router.post('/', verifyToken('TRAVELER'), validateRequest(reviewValidationSchema.createReviewValidationSchema), reviewController.createReview)

export const reviewRoutes = router