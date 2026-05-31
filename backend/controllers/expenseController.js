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
        const userId  =Number( req.params.userId)
        console.log(userId,typeof(userId));
        
        if (!userId) {
            return res.status(404).send('userId not found')
        }
        const getData = await expenseEntity.findAll({
            where: {
                userId: userId
            }
        })
        res.status(200).send({
            message: "All Expense list this user",
            reslt: getData
        })

    } catch (error) {
        res.status(400).send(`getExpense error for:${error}`)
    }
}

module.exports = {
    addExpense,
    getExpense
}