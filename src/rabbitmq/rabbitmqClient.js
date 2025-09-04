const amqp = require("amqplib")

const rabbitUrl = "amqp://localhost"
const QUEUE = "support_messages"

let connection = null
let channel = null


async function connetRabbitMQ() {
    connection = await amqp.connect(rabbitUrl)
    channel = await connection.createChannel()
    await channel.assertQueue(QUEUE, { durable: false })
    console.log("RabbitMQ connected and queue asserted :", QUEUE)
}

async function sendMessageToRabbitMQ(message) {
    if (!channel) throw new Error("RabbitMQ channel not intalized")
    const sent = channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)))
    return sent
}

async function startRabbitConsumer(onMessage) {
    if (!channel) throw new Error("RabbitMQ channel not intalized")
    await channel.consume(
        QUEUE,
        (msg) => {
            if (msg !== null) {
                let parsed = null
                try {
                    parsed = JSON.parse(msg.content.toString())
                } catch (e) {
                    parsed = msg.content.toString()
                }
                onMessage(parsed)
                channel.ack(msg)
            }
        }, {
        noack: false
    }
    )
    console.log("RabbitMQ consumer started for queue:", QUEUE);
}

async function disconnectAll() {
    try {
        await channel?.close();
        await connection?.close();
    } catch (e) {
        console.warn("RabbitMQ disconnect error:", e.message);
    }
}

module.exports = {
    connetRabbitMQ,
    sendMessageToRabbitMQ,
    startRabbitConsumer,
    disconnectAll
}

