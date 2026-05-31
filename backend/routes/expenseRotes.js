const express=require('express')
const { addExpense, getExpense, editExpense, deleteExpense } = require('../controllers/expenseController')

const router=express.Router()


router.post('/addExpense',addExpense)
router.get('/getExpense/:userId',getExpense)
router.put('/updateExpense',editExpense)
router.delete('/deleteExpense',deleteExpense)




module.exports=router