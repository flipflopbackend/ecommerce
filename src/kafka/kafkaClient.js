const { Kafka, logLevel, Partitioners } = require("kafkajs")

const brokers = ["localhost:9092"]
const clientId = "support-chat-app"
const topic = "support-messages"
const groupId = "support-consumer-group"

const kafka = new Kafka({
    clientId,
    brokers,
    logLevel: logLevel.INFO
})

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
})
const consumer = kafka.consumer({ groupId })

async function connectProducer() {
    await producer.connect()
    console.log("producer was connected");

}



async function sendMessageToKafka(messageObj) {
    // messageObj should be a JS object; we stringify it
    const payload = {
        topic,
        messages: [
            {
                key: messageObj.ticketId ? String(messageObj.ticketId) : null,
                value: JSON.stringify(messageObj),
            },
        ],
    };

    // kafkaJS returns a Promise; caller can measure timing
    return producer.send(payload);
}

async function startConsumer(onMessage) {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: false });
        console.log(`Kafka consumer subscribed to topic "${topic}"`);
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value ? message.value.toString() : null;
                let parsed = null;
                try { parsed = JSON.parse(value); } catch (e) { parsed = value; }
                // pass to handler
                if (onMessage) onMessage({ topic, partition, message: parsed });
            },
        });
    } catch (err) {
        console.error("Kafka consumer start error:", err.message);
    }
}

async function disconnectAll() {
    try { await producer.disconnect() } catch (e) { console.warn("producer disconnect", e.message) }
    try { await consumer.disconnect() } catch (e) { console.warn("consumer disconnect", e.message) }
}

module.exports = {
    connectProducer,
    startConsumer,
    sendMessageToKafka,
    disconnectAll,
    topic
}
