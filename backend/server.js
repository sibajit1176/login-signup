const express=require('express')
const cors=require('cors')
const db=require('./models/db')
// const userEntity=require('./models/userentity')
// const expenseEntity=require('./models/expensentity')
const asociation=require('./models/asociation')
const loginSignupRoute=require('./routes/loginSignupRoutes')
const expenseRoutes=require('./routes/expenseRotes')
const errormiddleware=require('./middleware/errormiddleware')

const app=express()
const port=5000

app.use(express.json())
app.use(cors())
app.use('/user',loginSignupRoute)
app.use('/expense',expenseRoutes)
app.use(errormiddleware)

app.get('/',(req,res)=>{
    res.send('Home page')
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