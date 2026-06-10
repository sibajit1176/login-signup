const express=require('express')
const { addExpense, getExpense, editExpense, deleteExpense } = require('../controllers/expenseController')
const { authMiddleware } = require('../middleware/authentication')
const { addWaletBalance } = require('../controllers/creditLogController')

const router=express.Router()


router.post('/addExpense',authMiddleware,addExpense)
router.get('/getExpense',authMiddleware,getExpense)
router.put('/updateExpense',editExpense)
router.delete('/deleteExpense',deleteExpense)
router.post('/addWaletBalance',authMiddleware,addWaletBalance)





module.exports=router