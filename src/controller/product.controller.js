const productService = require("../service/product.service");

module.exports = (logger) => {
    const createByProduct = async (req, res) => {
        try {
            const product = await productService.createProduct(req.body);
            logger.info(`New Product Created ${product.id}`);
            res.status(201).json({
                success: true,
                message: "New Product Created",
                product,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Product create failed",
                error: error.message,
            });
        }
    };

    const listAllProduct = async (req, res) => {
        try {
            const products = await productService.listAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "fetch function failed",
                error: error.message,
            });
        }
    };

    const getProduct = async (req, res) => {
        try {
            const product = await productService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    };

    const upgradeProduct = async (req, res) => {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            res.json(product);
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    };

    const removeProduct = async (req, res) => {
        try {
            await productService.deleteProduct(req.params.id);
            res.json({
                success: true,
                message: "Product successfully deleted",
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    };

    return {
        createByProduct,
        listAllProduct,
        getProduct,
        upgradeProduct,
        removeProduct,
    };
};
