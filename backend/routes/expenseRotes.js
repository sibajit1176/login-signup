const express=require('express')
const { addExpense, getExpense } = require('../controllers/expenseController')

const router=express.Router()


router.post('/addExpense',addExpense)
router.get('/getExpense/:userId',getExpense)



module.exports=router