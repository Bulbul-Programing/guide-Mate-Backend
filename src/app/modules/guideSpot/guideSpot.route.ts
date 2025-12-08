import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { guideValidationSchemas } from './guideSpot.validation';
import { guideController } from './guideSpot.controller';
import verifyToken from '../../middleware/verifyToken';

const router = express.Router()

router.get('/', guideController.getAllGuideSpots)
router.post('/', verifyToken('GUIDE'), validateRequest(guideValidationSchemas.guideSpotCreationSchema), guideController.createGuide)
router.patch('/:guideSpotId', verifyToken('GUIDE'), validateRequest(guideValidationSchemas.updateGuideSpotSchema), guideController.updateGuide)

export const guideSpotRoutes = router