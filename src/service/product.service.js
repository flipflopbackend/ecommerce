const productService = require("../models/product.model")


async function createProduct(data) {
    const product = await productService.createProduct(data)
    return product
}

async function listAllProduct() {
    return await productService.findallProduct()
}

async function getProductbyId(id) {
    const product = await productService.findProductId(id)
    if (!product) throw new Error("Product not found")
    return product
}

async function updateProduct(id, data) {
    const product = await productService.updateProduct(id, data)
    if (!product) throw new Error("Product not found")
    return product
}

async function deleteProduct(id) {
    const deleted = await productService.deleteProduct(id)
    if (!deleted) throw new Error("Product not found")
    return true
}

module.exports = {
    createProduct,
    listAllProduct,
    getProductbyId,
    updateProduct,
    deleteProduct
}

