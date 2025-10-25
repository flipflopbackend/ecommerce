const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mini E-commerce backend",
            version: "1.0.0",
            description: "API documentation for the mini-ecommerce project"
        },
        servers: [
            {
                url: "https://ecommerce-9b02.onrender.com"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [
        path.join(__dirname, "./router/*.js"),
        path.join(__dirname, "./utils/swagger.js")
    ]
};
// console.log(options)

const swaggerSpecs = swaggerJSDoc(options);

module.exports = (app) => {
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
};
