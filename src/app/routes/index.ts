import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.router';

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
    }
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router;