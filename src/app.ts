import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import { envVars } from './app/envConfig';
import { PaymentController } from './app/modules/payment/pament.controller';
import notFound from './app/middleware/notFound';

const app: Application = express();

app.post(
    "/stripe-webhook",
    express.raw({ type: "application/json" }),
    PaymentController.stripeWebhook
);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Server is running..",
        environment: envVars.NODE_ENV,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;