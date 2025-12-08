import express from "express";
import { PaymentController } from "./pament.controller";

const router = express.Router();

router.post(
    "/stripe-webhook",
    express.raw({ type: "application/json" }),
    PaymentController.stripeWebhook
);

export const PaymentRoutes = router;
