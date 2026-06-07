const {Sequelize,DataTypes}=require('sequelize')
const db=require('./db')

const paymentEntity=db.define('paymententity',{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    orderId:{
        type:DataTypes.STRING,
        // unique:true,
        allowNull:false
    },
    amount:{
       type:DataTypes.FLOAT,
       allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        // allowNull:false,
        defaultValue:"PENDING"
    }
})

module.exports=paymentEntity