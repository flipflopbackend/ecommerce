const userService = require("../service/user.service")


module.exports = (logger) => {
    const UserRegister = async (req, res) => {
        try {
            const { userName, email, password, role } = req.body
            await userService.createUser({ userName, email, password, role })
            logger.info(`New user created ${email}`)
            res.status(201).json({
                success: "true",
                message: "New user created"
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })

        }
    }

    const LoginByUser = async (req, res) => {
        try {
            const { email, password } = req.body
            const { token, userId } = await userService.loginUser(email, password)
            res.json({ token, userId })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }




    return {
        UserRegister,
        LoginByUser
    }
}




