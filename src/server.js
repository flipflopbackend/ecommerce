const { performance } = require("perf_hooks")
require("dotenv").config()
const { Server } = require("socket.io");
const http = require("http");
const { addMessage } = require("./models/support.model")
const redisClient = require("./redis/redisClient");
const server = http.createServer();



const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);


    socket.on("joinRoom", async (ticketId, sender) => {
        socket.join(ticketId);
        console.log(`${sender} joined room ${ticketId}`);


        try {
            const start = performance.now()
            const messages = await redisClient.lRange(`ticket:${ticketId}`, 0, -1)
            const end = performance.now()
            console.log(
                `Redis lRange latency for ticket:${ticketId} = ${(end - start).toFixed(2)} ms`
            );
            messages.forEach(msg => {
                socket.emit("chatMessage", JSON.parse(msg))
            })

        } catch (error) {
            console.log("Error reading from Redis : ", error.message);

        }
    });

    socket.on("chatMessage", async ({ ticketId, sender, text }) => {
        const message = { sender, text, time: new Date() }

        try {
            const start = performance.now();
            await redisClient.rPush(`ticket:${ticketId}`, JSON.stringify(message));
            const end = performance.now();
            console.log(
                `Redis rPush Store Timing for ticket:${ticketId} = ${(end - start).toFixed(2)} ms`
            );

            const startSQL = performance.now()
            await addMessage({ ticketId, sender, text })
            const endSQL = performance.now()
            console.log(
                `SQL DB Store Timing for ticket:${ticketId} = ${(endSQL - startSQL).toFixed(2)} ms`
            );
            io.to(ticketId).emit("chatMessage", message);

        } catch (error) {
            console.log("Error saving message to db:", error.message);
            socket.emit("error message", { message: error.message })
            return

        }

    });

    socket.on("disconnect", () => {
        console.log(" User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Support Chat server running on http://localhost:3000");
});
