const pool = require("../config/sql.db");



const createUser = async ({ userName, email, password, role = "user" }) => {
    const [rows] = await pool.query(`insert into users(userName,email,password,role)
     values(?,?,?,?)`, [userName, email, password, role])
    console.log(rows);

    return { id: rows.insertId, userName, email, password, role }
}

const findUserEmail = async (email) => {
    const [rows] = await pool.query(`select * from users where email = ?`, [email])
    console.log(rows);
    return rows[0]

}

const findUserId = async (id) => {
    const [rows] = await pool.query(`select id,userName,email,role,createdAt from users where id=?`, [id])
    return rows[0]
}





module.exports = {
    createUser,
    findUserEmail,
    findUserId
}