const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool