const { Sequelize, DataTypes } = require('sequelize')
const db = require('./db')

const expenseEntity = db.define('expenseentity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    spentMoney: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
        allowNull:false
    }
})

module.exports=expenseEntity