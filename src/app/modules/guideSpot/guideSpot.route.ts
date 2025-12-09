import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { guideValidationSchemas } from './guideSpot.validation';
import { guideController } from './guideSpot.controller';
import verifyToken from '../../middleware/verifyToken';

const router = express.Router()

router.get('/', guideController.getAllGuideSpots)
router.get('/details/:guideId', guideController.getGuideSpotsDetails)
router.post('/', verifyToken('GUIDE'), validateRequest(guideValidationSchemas.guideSpotCreationSchema), guideController.createGuide)
router.patch('/:guideSpotId', verifyToken('GUIDE'), validateRequest(guideValidationSchemas.updateGuideSpotSchema), guideController.updateGuide)
router.delete('/:guideSpotId', verifyToken('GUIDE', 'ADMIN'), guideController.deleteGuideSpot)

export const guideSpotRoutes = router