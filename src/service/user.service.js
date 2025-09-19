const bcrypt = require('bcrypt');
const User = require("../models/user.model")
const { generateToken } = require("../middleware/auth.token")

async function createUser({ userName, email, password, role }) {
    const hashpassword = await bcrypt.hash(password, 10)

    return await User.createUser({ userName, email, password: hashpassword, role })
}

async function loginUser(email, password) {
    const user = await User.findUserEmail(email)
    if (!user) throw new Error("user not found")
    let finduser = await bcrypt.compare(password, user.password)
    if (!finduser) throw new Error("Incorrect password")
    const token = await generateToken(user.id, user.role)
    return { token, userId: user.id }

}

module.exports = {
    createUser, loginUser
}