const Product = require("../models/product.model")
const Order = require("../models/order.model")
const OrderDetails = require("../models/orderdetails.model")


async function createOrder(userId, { productId, quantity }) {
    if (!productId || quantity == 0) throw new Error("No items")
    const product = await Product.findProductId(productId)
    if (!product) throw new Error(`Product ${productId} not found`)
    if (product.stock < quantity) throw new Error("Insufficient Stock")
    const total = Number(product.price) * Number(quantity)
    const order = await Order.createOrder({ userId, total })
    await OrderDetails.createOrderDetails({
        orderId: order.id,
        productId,
        quantity,
        price: product.price
    })

    await Product.updateProduct(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock - quantity
    })
    return { orderId: order.id, total }

}

async function getorder(orderId) {
    const order = await Order.findOrderId(orderId)
    if (!order) throw new Error("orderId not found")
    const details = await OrderDetails.listorderDetailsByOrder(order.id)
    return { order, details }

}

async function listUserOrders(userId) {
    return await Order.listordersByUser(userId)
}

async function listAllOrders() {
    await OrderDetails.listorderDetailsByOrder()
}

async function updateOrder(orderId, { status, tracking }) {
    await Order.updateOrderStatus({ orderId, status, tracking })
    return true

}

module.exports = {
    createOrder,
    getorder,
    listUserOrders,
    listAllOrders,
    updateOrder
}