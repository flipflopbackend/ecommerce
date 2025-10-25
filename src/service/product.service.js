const productModel = require("../models/product.model")

async function createProduct(data) {
    return await productModel.createProduct(data)
}

async function listAllProduct(limit, offset) {
    return await productModel.findAllProduct(limit, offset);
}

async function countAllProduct() {
    return await productModel.countAllProduct();
}
async function filterProduct(filters, limit, offset) {
    return await productModel.filterProduct(filters, limit, offset);
}

async function getProductById(id) {
    const product = await productModel.findProductId(id)
    if (!product) throw new Error("Product not found")
    return product
}

async function updateProduct(id, data) {
    const product = await productModel.updateProduct(id, data)
    if (!product) throw new Error("Product not found")
    return product
}

async function deleteProduct(id) {
    const deleted = await productModel.deleteProduct(id)
    if (!deleted) throw new Error("Product not found")
    return true
}

module.exports = {
    createProduct,
    listAllProduct,
    countAllProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    filterProduct
}
