const { Sequelize } = require("sequelize")
const sequelize = require("../models/db")
const expenseEntity = require("../models/expensentity")
const UserEntity = require("../models/userentity")

const getAllExpenseData=async(req,res)=>{
try {
    const getDatafromExpense=await expenseEntity.findAll({
        where:{
            isActive:true
        },
        attributes:['userId',
        [
            sequelize.fn(
                'SUM',
                Sequelize.col('spentMoney')
            ),
            'spentMoney'
        ]
        ],
        include:[
            {
                model:UserEntity,
                attributes:['userName','totalAmount']
            }
        ],
        group:[
            'userId',
            'userEntity.id'
        ],
        order:[
            [
                Sequelize.literal('spentMoney'),
                'DESC'
            ]
        ]
    })
    // const getDatafromExpense=await UserEntity.findAll({
    //     attributes:['id','userName','totalAmount'],
    //       order: [['totalAmount', 'DESC']]
    // })
    res.status(200).send({
        "message":"Get All expenses",
        getDatafromExpense
    })
} catch (error) {
     res.status(400).send({
        "message":`GetAllexpenses error for ${error}`
    })
}
}

module.exports={
    getAllExpenseData
}