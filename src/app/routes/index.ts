import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { guideSpotRoutes } from '../modules/guideSpot/guideSpot.route';
import { bookingRoutes } from '../modules/booking/booking.route';
import { reviewRoutes } from '../modules/review/review.route';

type TModuleRoutes = {
    path: string,
    route: express.Router
}
const router = express.Router();

const moduleRoutes: TModuleRoutes[] = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/guide-spot',
        route: guideSpotRoutes
    },
    {
        path: '/booking',
        route: bookingRoutes
    },
    {
        path: '/review',
        route: reviewRoutes
    },
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router;