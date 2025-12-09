import express from 'express';
import { bookingController } from './booking.controller';
import verifyToken from '../../middleware/verifyToken';
import { validateRequest } from '../../middleware/validateRequest';
import { bookingValidationSchema } from './booking.validation';

const router = express.Router()
router.get('/', bookingController.getAllBooking)
router.get('/my-booking', verifyToken('GUIDE', 'TRAVELER'), bookingController.getMyAllBooking)
router.post('/', verifyToken('TRAVELER'), validateRequest(bookingValidationSchema.createBookingValidationSchema), bookingController.createBooking)
router.put('/:bookingId', verifyToken('TRAVELER', 'ADMIN', 'GUIDE'), validateRequest(bookingValidationSchema.updateBookingSchema), bookingController.updateBookingStatus)

export const bookingRoutes = router