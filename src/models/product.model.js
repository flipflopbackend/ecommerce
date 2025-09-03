const pool = require("../config/sql.db");




const createProduct = async ({ name, description, price, stock }) => {
    const [rows] = await pool.query(`insert into products(name,description,price,stock) values(?,?,?,?)`, [name, description, price, stock])
    console.log(rows);

    return { id: rows.insertId, name, description, price, stock }
}

const findallProduct = async () => {
    const [rows] = await pool.query(`select * from products`)
    return rows
}

const findProductId = async (id) => {
    const [rows] = await pool.query(`select * from products where id =?`, [id])
    return rows[0]
}

const updateProduct = async (id, { name, description, price, stock }) => {
    const [rows] = await pool.query(
        `UPDATE products 
     SET name = ?, description = ?, price = ?, stock = ?
     WHERE id = ?`,
        [name, description, price, stock, id]
    );
    return findProductId(id)
}


const deleteProduct = async (id) => {
    const product = await findProductId(id)
    if (!product) return null
    await pool.query(`delete from products where id=?`, [id])
    return product
}

module.exports = {
    createProduct,
    findProductId,
    findallProduct,
    updateProduct,
    deleteProduct
}