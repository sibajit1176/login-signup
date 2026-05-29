const userEntity=require('../models/userentity')
const addUser=async (req,res)=>{
    try {
        const {name,email,password}=req.body
        const findUser=await userEntity.findOne({
            where:{
                userEmail:email
            }
        })
        if(findUser){
           return res.status(400).send({
                message:`${email} allready exists`
            })
        }
        const addUser=await userEntity.create({
            userName:name,
            userEmail:email,
            password:password
        })
     await addUser.save()
     res.status(201).send({
        message:"SignUp successful",
        data:addUser,
     })
    } catch (error) {
         res.status(400).send({
        message:`SignUp error for ${error}`,
     })
    }
}
module.exports={
    addUser
}