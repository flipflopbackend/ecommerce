const supportService = require("../service/support.service")

module.exports = (logger) => {
    const createSupportTicket = async (req, res) => {
        try {
            const { userId, orderId, issueType, message } = req.body
            if (!userId || !orderId || !issueType || !message) {
                return res.status(400).json({ success: false, message: "Missing required fields" })
            }

            const result = await supportService.createSupportTicket({ userId, orderId, issueType, message })
            res.status(201).json(result)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    const getTickets = async (req, res) => {
        try {
            const tickets = await supportService.getTickets()
            res.json(tickets)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    return {
        createSupportTicket,
        getTickets
    }
}
