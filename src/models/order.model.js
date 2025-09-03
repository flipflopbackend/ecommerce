const pool = require("../config/sql.db");

const createOrder = async ({ userId, total }) => {
    const [result] = await pool.query(`insert into orders (userId,total,status)
         values (?,?,"pending")`, [userId, total])
    const [rows] = await pool.query(`select * from orders where id =?`, [result.insertId])
    return rows[0]
}

const findOrderId = async (id) => {
    const [rows] = await pool.query(`select * from orders where id = ?`, [id])
    return rows[0] || null
}
const listordersByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT * FROM orders WHERE userId=? ORDER BY createdAt DESC`,
        [userId]
    )
    return rows
}


const allListByOrders = async () => {
    const [rows] = await pool.query(
        `SELECT * FROM orders ORDER BY createdAt DESC`
    )
    return rows
}


const updateOrderStatus = async ({ orderId, status, tracking }) => {
    const [result] = await pool.query(
        `UPDATE orders SET status=?, tracking = COALESCE(?, tracking) WHERE id=?`,
        [status, tracking || null, orderId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Order not found in SQL");
    }
    return result;
};



module.exports = {
    createOrder,
    findOrderId,
    updateOrderStatus,
    allListByOrders,
    listordersByUser
}