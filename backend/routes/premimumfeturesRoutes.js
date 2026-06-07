const express=require('express')
const { getAllExpenseData } = require('../controllers/premimumfeturesControlers')
const { getAiCall } = require('../controllers/Aiquerycontroler')
const route=express.Router()

route.get('/leaderBoard',getAllExpenseData)
route.post('/geminiresponse',getAiCall)

module.exports=route