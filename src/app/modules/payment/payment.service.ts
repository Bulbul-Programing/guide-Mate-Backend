import Stripe from "stripe";
import { prisma } from "../../config/db";

const handleCheckoutSuccess = async (
    session: Stripe.Checkout.Session
) => {
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
        throw new Error("Booking ID missing in Stripe metadata");
    }

    await prisma.$transaction(async (tx) => {
        // ✅ update payment
        await tx.payment.update({
            where: {
                bookingId,
            },
            data: {
                status: "PAID"
            },
        });
    });
};

export const PaymentService = {
    handleCheckoutSuccess,
};
