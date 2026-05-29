const express=require('express')
const { addUser, loginUser } = require('../controllers/addUserController')

const route=express.Router()

route.post('/signUp',addUser)
route.post('/login',loginUser)

module.exports=route