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
                status: "PAID",
                // Replace with correct field names from your Payment model
                // stripeSessionId: session.id,
                // stripePaymentIntentId: session.payment_intent as string,
            },
        });

        // ✅ update booking
        await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: "CONFIRMED",
            },
        });
    });
};

export const PaymentService = {
    handleCheckoutSuccess,
};
