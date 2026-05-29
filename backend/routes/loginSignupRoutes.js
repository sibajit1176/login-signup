const express=require('express')
const { addUser } = require('../controllers/addUserController')

const route=express.Router()

route.post('/signUp',addUser)

module.exports=route