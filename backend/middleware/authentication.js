const jwt=require('jsonwebtoken')
const publicKey = "yfyfuyk68hhnrifrkbf"

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization
    
    if(!authHeader){
        return res.status(401).send({
            message: 'Token required'
        });
    }
    const token=authHeader.split(' ')[1]
    try {
        const decode=jwt.verify(
            token,
            publicKey
        )
        req.user=decode
        next()
    } catch (error) {
         return res.status(401).send({
            message: 'Invalid token',
            error
        });  
    }
}

module.exports={authMiddleware}