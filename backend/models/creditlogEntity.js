const {Sequelize, DataTypes}=require('sequelize')
const db=require('./db')

const creditLogEntity=db.define('creditLogEntity',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    creditForm:{
        type:DataTypes.STRING,
        allowNull:false
    },
    desc:{
        type:DataTypes.STRING
    },
    amount:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})
module.exports=creditLogEntity