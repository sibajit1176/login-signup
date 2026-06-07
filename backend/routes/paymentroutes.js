const express=require('express')
const router=express.Router()

const {authMiddleware}=require('../middleware/authentication')
const { createOrder, verfyPayment } = require('../controllers/paymentcontroller')


router.post('/create-order',authMiddleware,createOrder)
router.get('/verify/:orderId',authMiddleware,verfyPayment)

module.exports=router