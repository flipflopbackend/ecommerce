const orderService = require("../service/order.service")


module.exports = (logger) => {
    const ordercreate = async (req, res) => {
        try {
            const userId = req.user.sqlid
            const result = await orderService.createOrder(userId, req.body)
            res.status(201).json(result)
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "ordercreate function is failed",
                error: error.message
            })
        }
    }

    const getorder = async (req, res) => {
        try {
            const result = await orderService.getorder(req.params.id)
            res.json(result)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "getorder function is failed",
                error: error.message
            })
        }

    }
    const UserOrders = async (req, res) => {
        try {
            const orders = await orderService.listUserOrders(req.user.sqlid)
            res.json(orders)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "userOrders function is failed",
                error: error.message
            })
        }
    }

    const AlllistOrders = async (req, res) => {
        try {
            const orders = await orderService.listAllOrders()
            res.json(orders)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "AlllistOrder function is failed",
                error: error.message
            })
        }
    }

    const updateOrder = async (req, res) => {
        try {
            await orderService.updateOrder(req.params.id, req.body)
            res.json({
                success: true,
                message: "successfully Order Updated"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "UpdateOrder function is failed",
                error: error.message
            })
        }
    }

    return {
        ordercreate,
        getorder,
        UserOrders,
        AlllistOrders,
        updateOrder

    }
}