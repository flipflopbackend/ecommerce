const path = require("path")
const winston = require("winston")


const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({ format: "YY-MM-DD HH-mm-ss" }),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.combine(),
                winston.format.colorize(),
                winston.format.printf((level, message, timestamp) => {
                    return `${timestamp} ${level}:${message}`
                })

            )
        }),
        new winston.transports.File({ filename: path.join(__dirname, "../logs/error.log"), level: "error" }),
        new winston.transports.File({ filename: path.join(__dirname, "../logs/combined.log"), level: "info" }),
        new winston.transports.Http({
            host: "localhost",
            port: process.env.PORT,
            path: "/logs",
            ssl: false
        })
    ]
})


module.exports = logger