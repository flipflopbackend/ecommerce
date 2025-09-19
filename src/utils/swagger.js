/**
 * @swagger
 * tags: 
 *   - name: Auth
 *     description: User authentication
 */

/**
 * @swagger
 * /usercreate:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /userlogin:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: yourexample@gmail.com
 *               password:
 *                 type: string
 *                 
 *     responses:
 *       200:
 *         description: Login successfully
 *       404:
 *         description: User not found or incorrect password
 *       500:
 *         description: server error
 */

/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Product Management (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Laptop"
 *         description:
 *           type: string
 *           example: "High-budget gaming Laptop"
 *         price:
 *           type: number
 *           example: 1800
 *         stock:
 *           type: integer
 *           example: 10
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "New Product Created"
 *         product:
 *           $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /createproduct:
 *   post:
 *     summary: Create a new Product (Admin only)
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - only admin can create product
 *       500:
 *         description: Product creation failed
 */

/**
 * @swagger
 * /allproducts/{page}/{limit}:
 *   get:
 *     summary: List all products with pagination
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (starting from 1)
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Products fetched successfully with pagination            
 *       500:
 *         description: Server Error
 */


/**
 * @swagger
 * /{id}/products:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /{id}/updateproducts:
 *   patch:
 *     summary: Update the product (Admin only)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - only admin can update products
 *       500:
 *         description: Product updation failed
 */

/**
 * @swagger
 * /{id}/deleteproduct:
 *   delete:
 *     summary: Delete the product (Admin only)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product successfully deleted"
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Order Management 
 */

/**
 * @swagger
 * /orderproduct:
 *   post:
 *     summary: create a orderproduct
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: "1"
 *               quantity:
 *                 type: integer
 *                 example: "2"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       404:
 *         description: Product not found or insufficient for stock
 *       401:
 *         description: unauthorized - invalid token
 *       500:
 *         description: Order creation failed
 *      
 */

/**
 * @swagger
 * /{id}/getorder:
 *   get:
 *     summary: get an orderdetails 
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Id of the order
 *         example: 12
 *     responses:
 *       200:
 *         description: Order retrieved successfully 
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized - invalid token
 *       500:
 *         description: Failed to retreive order
 */

/**
 * @swagger
 * /userorders:
 *   get:
 *     summary: Get all order in User
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized - invalid token
 *       500:
 *         description: Failed to fetch user orders
 */

/**
 * @swagger
 * /allorders:
 *   get:
 *     summary: Get of all Orders (Admin only)
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: List of all Orders
 *       401:
 *         description: Unauthorized - invailed or missing token
 *       403:
 *         description: Forbidden - only admin can see all Orders
 *       500:
 *         description: Failed to fetch all order
 */

/**
 * @swagger
 * /{id}/updateorder:
 *   patch:
 *     summary: Update an order status and tracking (Admin only)
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: integer
 *         description: the Id of the order to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "shipped"
 *               tracking:
 *                 type: string
 *                 example: "TRACK0123"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid input (missing or wrong status/tracking)
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - only admin can update orders
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to update order                 
 */

/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Payment Management
 */

/**
 * @swagger
 * /create-payment:
 *   post:
 *     summary: create a payment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:    
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "10"
 *     responses:
 *       200:
 *         description: Stripe checkout session created
 *       404:
 *         description: OrderId not found
 *       500:
 *         description: Failed create Stripe checkout session
 * 
 */

/**
 * @swagger
 * tags:
 *   - name: Support
 *     description: Ticket Session
 */

/**
 * @swagger
 * /createticket:
 *   post:
 *     summary: create a new Support ticket
 *     tags: [Support]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - orderId
 *               - issueType
 *               - message
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 110
 *               orderId:
 *                 type: integer
 *                 example: 23
 *               issueType:
 *                 type: string
 *                 example: "Payment"
 *               message:
 *                 type: string
 *                 example: "My payment was deducted but order is not confirmed"
 *     responses:
 *       200:
 *         description: ticket is successfully created
 *       400:
 *         description: Missing required fields
 *       500: 
 *         description: Internal server Error
 */