const express=require('express')
const cors=require('cors')
const path=require('path')
const db=require('./models/db')
const fs=require('fs')
require('dotenv').config()
// const userEntity=require('./models/userentity')
// const expenseEntity=require('./models/expensentity')
const asociation=require('./models/asociation')
const loginSignupRoute=require('./routes/loginSignupRoutes')
const expenseRoutes=require('./routes/expenseRotes')
const errormiddleware=require('./middleware/errormiddleware')
const paymentRouter=require('./routes/paymentroutes')
const premimumfeturesRoutes=require('./routes/premimumfeturesRoutes')

const app=express()
const port=5000

app.use(express.json())
app.use(cors())
app.use(
    express.static(
        path.join(__dirname,'../view')
    )
)
app.use('/user',loginSignupRoute)
app.use('/expense',expenseRoutes)
app.use('/payment',paymentRouter)
app.use('/premimum',premimumfeturesRoutes)

app.use(errormiddleware)

app.get('/',(req,res)=>{
    res.redirect('/signup.html');
})
app.use((req,res)=>{
    res.send('<h1>Page not found</h1>')
})
const server=async ()=>{
    try {
        await db.authenticate()
        console.log('database connected');
        await db.sync({alter:true})
        app.listen(port,()=>{
           
    console.log(`Server run on ${port}`);
    
})
        
    } catch (error) {
        console.log(error);
        
    }
}
server()