const redis = require('redis');


const client = redis.createClient({
    url: "redis://127.0.0.1:6379",
    socket: {
        reconnectStrategy: (retries) => {
            console.log(`Retry attempt: ${retries}`);
            return Math.min(retries * 50, 500)

        }
    }
});


client.on("error", (err) => {
    console.error("Redis Client Error:", err);
    process.exit(1);
});


client.on("connect", () => console.log("Redis client connecting..."));
client.on("ready", () => console.log("Redis connected and ready"));


async function connectRedis() {
    try {
        await client.connect();
        console.log("Redis connected");
        return client;
    } catch (err) {
        console.error("Redis connection failed:", err);
        process.exit(1);
    }
}


process.on("SIGINT", async () => {
    try {
        await client.disconnect();
        console.log("Redis disconnected gracefully");
        process.exit(0);
    } catch (err) {
        console.error("Error during Redis disconnect:", err);
        process.exit(1);
    }
});


connectRedis();

module.exports = client;
