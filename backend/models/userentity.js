const {Sequelize, DataTypes}=require('sequelize')
const db=require('./db')

const UserEntity=db.define('userEntity',{
    id:{
        type:DataTypes.INTEGER,
       primaryKey:true,
       autoIncrement:true
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false
    },
     userEmail:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:false
    },
     password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isPrime:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    
})
module.exports=UserEntity