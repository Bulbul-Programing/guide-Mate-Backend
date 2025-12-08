import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../../utils/stripe";
import { PaymentService } from "./payment.service";
import { envVars } from "../../envConfig";

const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            envVars.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error("Webhook verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        await PaymentService.handleCheckoutSuccess(session);
    }

    res.json({ received: true });
};

export const PaymentController = {
    stripeWebhook,
};
