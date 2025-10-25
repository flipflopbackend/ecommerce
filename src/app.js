require("dotenv").config()
const express = require('express');
const db = require("./config/sql.db");
const logger = require("./utils/logger");
const authRouter = require("./router/auth.router");
const swagger = require("./swagger.config");
const cors = require("cors")


const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((req, res, next) => {
    if (req.originalUrl === "/payment/webhook") {
        next();
    } else {
        express.json()(req, res, () => {
            express.urlencoded({ extended: true })(req, res, next);
        });
    }
});


db.query("select 1").then(() => {
    console.log("Mysql connected successfully");

}).catch((e) => {
    console.error(e.message);

})
swagger(app)




app.use(authRouter(logger))


port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    logger.info("Mysql connected running on live")

})

app.use("/", (req, res) => {
    res.send("I'm Alive")
})
