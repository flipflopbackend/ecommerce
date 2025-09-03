const express = require("express")
const fs = require("fs")
const path = require('path');



module.exports = (logger) => {
    const router = express.Router()
    const files = fs.readdirSync(__dirname)
    files.forEach((file) => {
        if (file != "index.js" && file.endsWith(".router.js")) {
            const routerFactory = require(path.join(__dirname, file))
            const route = routerFactory(logger)
            const routefile = "/" + file.replace(".router.js", "")
            router.use(routefile, route)
        }
    })
    return router
}