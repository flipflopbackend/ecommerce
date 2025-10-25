const express = require('express');
const { validateUser } = require('../validation/validation');
const { isAdmin, verifyToken } = require('../middleware/auth.token');

module.exports = (logger) => {
    const router = express.Router()
    const { UserRegister, LoginByUser } = require("../controller/auth.controller")(logger)
    const { createByProduct, filterProductByName, listAllProduct, getProduct, upgradeProduct, removeProduct } = require("../controller/product.controller")(logger)
    const { ordercreate, getorder, UserOrders, AlllistOrders, updateOrder } = require("../controller/order.controller")(logger)
    const { createPayment, handleWebhook } = require("../controller/payment.controller")(logger)
    const { createSupportTicket, getTickets } = require('../controller/support.controller')(logger)


    //Signin and Signup (User or Admin panel)

    router.post("/usercreate", validateUser, UserRegister)
    router.post("/userlogin", LoginByUser)

    //products admin panel

    router.post("/createproduct", verifyToken, isAdmin, createByProduct)
    router.patch("/:id/updateproducts", verifyToken, isAdmin, upgradeProduct)
    router.delete("/:id/deleteproduct", verifyToken, isAdmin, removeProduct)


    //products for user panel

    router.get("/allproducts/:page/:limit", listAllProduct)
    router.get("/:id/products", getProduct)

    //orderpage in userpanel

    router.post("/orderproduct", verifyToken, ordercreate)
    router.get("/:id/getorder", verifyToken, getorder)
    router.get("/userorders", verifyToken, UserOrders)

    //orderpage in adminpanel
    router.get("/products/filter", filterProductByName);

    router.get("/allorders", verifyToken, isAdmin, AlllistOrders)
    router.patch("/:id/updateorder", verifyToken, isAdmin, updateOrder)

    //payment by stripe

    router.post("/create-payment", createPayment)
    router.post(
        "/payment/webhook",
        express.raw({ type: "application/json" }),
        handleWebhook
    );

    //communication message in socket.io
    router.post("/createticket", createSupportTicket)
    router.get("/alltickets", getTickets)


    return router
}