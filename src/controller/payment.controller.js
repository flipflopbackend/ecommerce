const paymentService = require("../service/payment.service")




module.exports = (logger) => {

    const createPayment = async (req, res) => {
        try {
            const { orderId } = req.body
            let url = await paymentService.createPayment(orderId)
            res.json({ url })

        } catch (error) {
            res.json({
                error: error.message
            })

        }
    }


    const handleWebhook = async (req, res) => {
        try {
            const sig = req.headers["stripe-signature"];
            const eventType = await paymentService.handleWebhook(req.body, sig)
            res.send("Payment Successful");
        } catch (err) {
            console.error(" Webhook Processing Error:", err);
            res.status(500).json({ error: err.message });
        }
    }
    return {
        createPayment,
        handleWebhook

    }
}

























































