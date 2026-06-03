const expenseEntity = require('../models/expensentity')
const userEntity = require('../models/userentity')

const addExpense = async (req, res) => {
    try {
        const { userId, spentMoney, desc, category } = req.body
        if (!userId) {
            return res.status(404).send('userId not found')
        }
        if (!spentMoney || !category) {
            return res.status(400).send('spent money and category need')
        }
        const findUser = await userEntity.findOne({
            where: {
                id: userId
            }
        })
        if (!findUser) {
            return res.status(404).send('Wrong userId')
        }
        const addExpense = await expenseEntity.create({
            userId, spentMoney, desc, category
        })
        await addExpense.save()
        res.status(201).send({
            message: "Expense added",
            reslt: addExpense
        })
    } catch (error) {
        res.status(400).send(`addExpense error for:${error}`)
    }
}
const getExpense = async (req, res) => {
    try {
        const userId = Number(req.params.userId)
        
        if (!userId) {
            return res.status(404).send('userId not found')
        }
        const getData = await expenseEntity.findAll({
            where: {
                userId: userId
            }, 
            order: [['createdAt', 'DESC']]
        })
        res.status(200).send({
            message: "All Expense list this user",
            reslt: getData
        })

    } catch (error) {
        res.status(400).send(`getExpense error for:${error}`)
    }
}
const editExpense = async (req, res) => {
    try {
        const eId = req.query.eId
        const { spentMoney, desc, category } = req.body
        if (!eId) {
            return res.status(404).send('Id not found')
        }
        const findData = await expenseEntity.findOne({
            where: {
                id: eId
            }
        })
        if (!findData) {
            return res.status(404).send('data not found')

        }
        const updateData = await expenseEntity.update({
            spentMoney: spentMoney ?? findData.spentMoney,
            desc: desc ?? findData.desc,
            category: category ?? findData.category
        }, {
            where: {
                id: eId
            }
        })
        res.status(200).send({
            message: "Expense updated",
            reslt: updateData
        })

    } catch (error) {
        res.status(400).send(`update expense error for:${error}`)

    }
}
const deleteExpense = async (req, res) => {
    try {
        const eId = req.query.eId
        if (!eId) {
            return res.status(404).send('Id not found')
        }
        const findData = await expenseEntity.findOne({
            where: {
                id: eId
            }
        })
        if (!findData) {
            return res.status(404).send('data not found')

        }
        const deleteData = await expenseEntity.destroy({
            where: {
                id: eId
            }
        })
        res.status(200).send({
            message: "Expense deleted",
            reslt: deleteData
        })

    } catch (error) {
        res.status(400).send(`delete expense error for:${error}`)

    }
}

module.exports = {
    addExpense,
    getExpense,
    editExpense,
    deleteExpense
}