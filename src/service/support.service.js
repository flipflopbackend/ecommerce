const { createTicket, listTicket } = require("../models/support.model");


const createSupportTicket = async ({ userId, orderId, issueType, message }) => {
    const ticket = await createTicket({ userId, orderId, issueType, message })
    return {
        success: true,
        ticket,
        autoReply: {
            subject: `Support Ticket #${ticket.id} created`,
            message: `Your support request for order ${orderId} has been received. Ticket #${ticket.id} is now open`
        },
        roomId: ticket.id
    }
}

const getTickets = async () => {
    const tickets = await listTicket()
    return {
        success: true,
        tickets
    }
}

module.exports = {
    createSupportTicket, getTickets
}