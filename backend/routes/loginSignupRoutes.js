const express=require('express')
const { addUser, loginUser } = require('../controllers/addUserController')
const { sendOtp, verifyOtp, updatePassword } = require('../controllers/sendEmailController')

const route=express.Router()

route.post('/signUp',addUser)
route.post('/login',loginUser)
route.post('/sendOtp',sendOtp)
route.post('/verifyOtp',verifyOtp)
route.post('/updatePassword',updatePassword)



module.exports=route