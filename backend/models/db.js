const {Sequelize}=require('sequelize')


const sequelize=new Sequelize('testdb','root','siba',{
    host:"localhost",
    dialect:'mysql'
})

module.exports=sequelize
