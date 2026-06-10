const crypto=require('crypto')
const redisClient=require('../config/redis')
const transporter=require('../config/mailservice')
const userEntity=require('../models/userentity')

const sendOtp=async(req,res)=>{
    try {
        const {email}=req.body
        const user=await userEntity.findOne({
            where:{
                userEmail:email
            }
        })
        if(!user){
            return res.status(404).send({
                  success: false,
                message: 'User not found'
            })
        }
              
        const otp=crypto.randomInt(
            100000,999999
        );
        await redisClient.set(
            `otp:${email}`,
            otp,
            'EX',
            300
        )
         await transporter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:'Password Reset OTP',
            html: `
                <h2>Password Reset OTP</h2>
                <h3>${otp}</h3>
                <p>Valid for 5 minutes.</p>
            `
        })
           return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp
        });
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: error
        });

    }
}

module.exports={
    sendOtp
}