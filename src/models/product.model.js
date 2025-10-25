const pool = require("../config/sql.db");




const createProduct = async ({ name, description, price, stock }) => {
    const [rows] = await pool.query(`insert into products(name,description,price,stock) values(?,?,?,?)`, [name, description, price, stock])
    console.log(rows);

    return { id: rows.insertId, name, description, price, stock }
}


const findAllProduct = async (limit, offset) => {
    const [rows] = await pool.query(
        `SELECT * FROM products LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows;
};

const countAllProduct = async () => {
    const [[result]] = await pool.query(
        `SELECT COUNT(*) as totalCount FROM products`
    );
    return result.totalCount;
};
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

const filterProduct = async (filters = {}, limit = 10, offset = 0) => {
    let query = `SELECT * FROM products WHERE 1=1 `;
    const params = [];

    if (filters.name) {
        query += `AND name LIKE ? `;
        params.push(`%${filters.name}%`);
    }

    query += `LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
};
const deleteProduct = async (id) => {
    const product = await findProductId(id)
    if (!product) return null
    await pool.query(`delete from products where id=?`, [id])
    return product
}

module.exports = {
    createProduct,
    findProductId,
    findAllProduct,
    countAllProduct,
    updateProduct,
    deleteProduct,
    filterProduct
}