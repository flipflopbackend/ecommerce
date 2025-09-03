const Stripe = require("stripe")
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const Order = require("../models/order.model")
const Payment = require("../models/payment.model")

async function createPayment(orderId) {
    let order = await Order.findOrderId(orderId)
    if (!order) throw new Error("Order not found")

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_date: {
                    currency: "usd",
                    product_data: {
                        name: `Order #${order.id}`

                    },
                    unit_amount: Math.round(Number(order.total) * 100)

                },
                quantity: 1,
            }
        ],
        metadata: { orderId: String(order.id) },
        payment_intent_data: {
            metadata: { orderId: String(order.id) }
        },
        success_url: `http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:5000/cancel"

    })
    return session.url
}

async function handleWebhook(payload, sig) {
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            payload,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const pi = event.data.object;
            const orderId = pi.metadata.orderId;

            await Payment.createPayment({
                orderId,
                stripePaymentId: pi.id,
                amount: pi.amount / 100,
                status: "PAYMENT SUCCESS",
            });

            await Order.updateOrderStatus({
                orderId,
                status: "PAID",
                tracking: "PAYMENT RECEIVED",
            });
            break;
        }

        case "payment_intent.payment_failed": {
            const pi = event.data.object;
            const orderId = pi.metadata.orderId;

            await Payment.createPayment({
                orderId,
                stripePaymentId: pi.id,
                amount: pi.amount / 100,
                status: "PAYMENT FAILED",
            });

            await Order.updateOrderStatus({
                orderId,
                status: "FAILED",
                tracking: "PAYMENT FAILED",
            });
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return event.type;
}


module.exports = {
    createPayment, handleWebhook
}