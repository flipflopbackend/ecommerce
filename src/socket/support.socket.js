const { addMessage } = require("../models/support.model")

function supportSocket(io) {
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id)

        socket.on("joinRoom", (ticketId) => {
            if (!ticketId) return
            socket.join(ticketId)
            console.log(`Client joined room ${ticketId}`)
        })

        socket.on("sendMessage", async ({ ticketId, sender, text }) => {
            try {
                if (!ticketId || !text) {
                    return socket.emit("errorMessage", {
                        message: "ticketId and text are required",
                    });
                }
                const message = await addMessage({ ticketId, sender, text })
                const fullMessage = {
                    ...message,
                    timestamp: new Date(),
                };
                io.to(ticketId).emit("newMessage", fullMessage)
            } catch (err) {
                console.error("Error saving message:", err.message)
                socket.emit("errorMessage", { message: "Failed to send message" })
            }
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id)
        })
    })
}

module.exports = supportSocket
