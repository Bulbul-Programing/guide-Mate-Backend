import express from 'express';
import { userRoutes } from '../modules/user/user.route';

type TModuleRoutes = {
    path: string,
    route: express.Router
}
const router = express.Router();

const moduleRoutes: TModuleRoutes[] = [
    {
        path: '/user',
        route: userRoutes
    }
]
moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router;