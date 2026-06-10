const express=require('express')
const { addUser, loginUser } = require('../controllers/addUserController')
const { sendOtp } = require('../controllers/sendEmailController')

const route=express.Router()

route.post('/signUp',addUser)
route.post('/login',loginUser)
route.post('/sendOtp',sendOtp)

module.exports=route