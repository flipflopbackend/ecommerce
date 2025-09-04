const { performance } = require("perf_hooks")
require("dotenv").config()
const { Server } = require("socket.io");
const http = require("http");
const { addMessage } = require("./models/support.model")
const redisClient = require("./redis/redisClient");
const server = http.createServer();
const { sendMessageToKafka, connectProducer, startConsumer, topic } = require("./kafka/kafkaClient")
const { connetRabbitMQ, sendMessageToRabbitMQ, startRabbitConsumer, disconnectAll } = require("./rabbitmq/rabbitmqClient")



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
        const message = { ticketId, sender, text, time: new Date() }

        try {
            //Karfa time check 
            console.log("///////////////////////////////////////////////////////////////////////////////////");
            const KarfaStart = performance.now()
            await sendMessageToKafka(message)
            const KarfaEnd = performance.now()
            console.log(`Karfa timing to ticket:${ticketId} = ${(KarfaEnd - KarfaStart).toFixed(2)}ms`)

            //rabbit time check
            const RabbitStart = performance.now()
            await sendMessageToRabbitMQ(message)
            const RabbitEnd = performance.now()
            console.log(`RabbitMQ publish timing for ticket:${ticketId} = ${(RabbitEnd - RabbitStart).toFixed(2)}ms`);

            console.log("//////////////////////////////////////////////////////////////////////////////////")
            //redis time check
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
            console.log("...........................................................");

            // io.to(ticketId).emit("chatMessage", message);

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

// Karfa starting consumer 
(async () => {
    try {
        //receive the message
        await connectProducer()
        await startConsumer(({ topic, partition, message }) => {
            const ticketId = message.ticketId;
            if (ticketId) {
                const KarfaStart = performance.now()
                io.to(ticketId).emit("chatMessage", message);
                const KarfaEnd = performance.now()
                console.log(`Karfa send message timing to ticket ${ticketId} = ${(KarfaEnd - KarfaStart).toFixed(2)}ms`)

            } else {
                console.warn("Received message without ticketId:", message);
            }
        });


    } catch (error) {
        console.log("Karfa start error", error)
    }
})()

// RabbitMQ starting consumer
const Rabbitconnet = async () => {
    try {
        //receive the message
        await connetRabbitMQ()
        await startRabbitConsumer((message) => {
            const ticketId = message.ticketId
            if (ticketId) {
                const RabbitStart = performance.now()
                io.to(ticketId).emit("chatMessage", message)
                const RabbitEnd = performance.now()
                console.log(`RabbitMQ send message timing for ticket:${ticketId} = ${(RabbitEnd - RabbitStart).toFixed(2)}ms`);
            }
            else {
                console.warn("Received message without ticketId:", message);
            }
        })
    } catch (error) {
        console.log("Rabbit start error", error)
    }
}

Rabbitconnet()


async function shutdown() {
    console.log("Shutting down...");
    await disconnectAll();
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
