const pool = require("../config/sql.db");

const createPayment = async ({ orderId, stripePaymentId, amount, status }) => {
    const [result] = await pool.query(`insert into payments(orderId,stripePaymentId,amount,status) 
    values(?,?,?,?)`, [orderId, stripePaymentId, amount, status])

    const [payment] = await pool.query(`select * from payments where id = ?`, [result.insertId])
    return payment[0]
}

module.exports = { createPayment }