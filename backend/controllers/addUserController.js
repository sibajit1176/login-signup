const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userEntity = require('../models/userentity')

const saltRound = 10
const publicKey = "yfyfuyk68hhnrifrkbf"
const privetKey = "yfyfuyk68hhnrifrkbf"


const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const findUser = await userEntity.findOne({
            where: {
                userEmail: email
            }
        })
        if (findUser) {
            return res.status(400).send({
                message: `${email} allready exists`
            })
        }
        const hashPassword = await bcrypt.hash(password, saltRound)
        const addUser = await userEntity.create({
            userName: name,
            userEmail: email,
            password: hashPassword
        })
        await addUser.save()
         const payload = {
            userId: addUser.id,
            username: addUser.userName,
            useremail:addUser.userEmail,
            
        }
        const token = jwt.sign(payload, publicKey, { expiresIn: '1d' })
        res.status(201).send({
            message: "SignUp successful",
            token,
        })
    } catch (error) {
        res.status(400).send({
            message: `SignUp error for ${error}`,
        })
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const findUser = await userEntity.findOne({
            where: {
                userEmail: email
            }
        })
        if (!findUser) {
            return res.status(404).send({
                message: `${email} not found`
            })
        }
        const originalPassword = await bcrypt.compare(password, findUser.password)

        if (!originalPassword) {
            return res.status(401).send({
                message: `Wrong password`
            })
        }
        const payload = {
            userId: findUser.id,
            username: findUser.userName,
            useremail:findUser.userEmail,
            
        }
        const token = jwt.sign(payload, publicKey, { expiresIn: '1d' })
        return res.status(200).send({
            message: `${findUser.userName} loggedin`,
            userId: findUser.id,
            token
        })
    } catch (error) {
        return res.status(500).send({
            message: `login errpr for ${error} `
        })
    }
}
module.exports = {
    addUser,
    loginUser
}