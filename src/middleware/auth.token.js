const jwt = require('jsonwebtoken');



const key = process.env.TOKEN_KEY


const generateToken = async (sqlid, role) => {
    return jwt.sign({ sqlid, role }, key, { expiresIn: "1h" })
}

const verifyToken = async (req, res, next) => {
    const authheader = req.headers["authorization"]
    const token = authheader && authheader.split(" ")[1]
    if (!token) return res.status(401).json({ message: "No token include" })

    jwt.verify(token, key, (err, decoded) => {
        if (err) return res.status(403).json({ message: "token has been expired" })
        req.user = decoded
        next()
    })
}

const isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" })
    next()
}

module.exports = {
    generateToken,
    verifyToken,
    isAdmin
}

