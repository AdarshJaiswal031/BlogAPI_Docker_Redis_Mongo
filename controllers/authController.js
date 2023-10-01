const User = require('../models/userModel')
const bcrypt = require("bcryptjs")
exports.signUp = async (req, res) => {
    const { username, password } = req.body
    try {
        const hashpassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashpassword
        })
        req.session.user = newUser
        res.status(201).json({
            status: "success",
            data: {
                newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "failed"
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "user not found!"
            })
        }
        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect) {
            req.session.user = user

            res.status(200).json({
                status: "success",
                password: user.password
            })
        }
        else {
            res.status(400).json({
                status: "failed",
                message: "username or password not correct"
            })
        }

    } catch (e) {
        console.log(e)
        res.status(400).json({
            status: "failed"
        })
    }
}