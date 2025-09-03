const joi = require("joi")




const uservalidationSchema = joi.object({
    userName: joi.string()
        .min(3)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be atleast 3 letters"
        }),
    email: joi.string()
        .email()
        .pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
        .required()
        .messages({
            "string.empty": "email is required",
            "string.email": "invaild format"
        }),
    password: joi.string()
        .min(6)
        .required()
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
        .messages({
            "string.empty": "password is required",
            "string.min": "password must be 6 letters",
            "string.pattern.base": "password must be one uppercase letter, one lowercase letter, one special character, one number and 6 must be letters long"
        }),
    role: joi.string()
        .optional()
})


const validateUser = (req, res, next) => {
    const { error } = uservalidationSchema.validate(req.body)
    if (error) {
        return res.status(404).json({
            success: false,
            message: "validation failed",
            error: error.details.map(err => err.message)

        })
    }
    next()

}

module.exports = { validateUser }