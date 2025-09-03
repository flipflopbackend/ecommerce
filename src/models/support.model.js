const pool = require("../config/sql.db")


const createTicket = async ({ userId, orderId, issueType, message }) => {
    const [ticketRows] = await pool.query(`insert into supporttickects(userId, orderId, issueType, status) 
        values(?,?,?,"open")`, [userId, orderId, issueType])
    const ticketId = ticketRows.insertId

    await addMessage({ ticketId, sender: "customer", text: message })
    return { id: ticketId, userId, orderId, issueType, status: "open" }
}

const addMessage = async ({ ticketId, sender, text }) => {
    const [ticketRows] = await pool.query(
        "SELECT id FROM supporttickects WHERE id = ?",
        [ticketId]
    );
    if (!ticketRows.length) throw new Error(`Ticket ${ticketId} does not exist`);

    const [rows] = await pool.query(
        "INSERT INTO supportmessages(ticketId, sender, text) VALUES (?, ?, ?)",
        [ticketId, sender, text]
    );
    return { id: rows.insertId, ticketId, sender, text };
};


const listTicket = async () => {
    const [rows] = await pool.query(`select * from supporttickects order by id desc limit 1`);
    if (!rows.length) return null;
    return rows.length ? rows[0] : null;;
}



module.exports = {
    createTicket, addMessage, listTicket
}