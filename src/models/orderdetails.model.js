const pool = require("../config/sql.db");


const createOrderDetails = async ({ orderId, productId, quantity, price }) => {
    const [result] = await pool.query(`insert into orderdetails(orderId ,productId, quantity, price) 
        values(?,?,?,?)`, [orderId, productId, quantity, price])
    const [details] = await pool.query(`select * from orderdetails where id=?`, [result.insertId])
    return details[0]
}
const listorderDetailsByOrder = async (orderId) => {
    const [rows] = await pool.query(
        `SELECT od.*, p.name, p.description 
         FROM orderdetails od 
         JOIN products p ON p.id = od.productId 
         WHERE od.orderId = ?`,
        [orderId]
    )
    return rows
}


module.exports = {
    createOrderDetails,
    listorderDetailsByOrder
}