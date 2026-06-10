const sequelize = require('../models/db')
const expenseEntity = require('../models/expensentity')
const userEntity = require('../models/userentity')

const addExpense = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const userId = req.user.userId;
        const { spentMoney, desc, category } = req.body;

        if (!userId) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!spentMoney || !category) {

            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Spent money and category are required"
            });
        }

        const findUser = await userEntity.findOne({
            where: {
                id: userId
            },
            transaction
        });

        if (!findUser) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Invalid user"
            });
        }

        if (Number(findUser.totalAmount) < Number(spentMoney)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Insufficient balance"
            });
        }

        const updatedBalance =
            Number(findUser.totalAmount) -
            Number(spentMoney);

        const expense = await expenseEntity.create(
            {
                userId,
                spentMoney,
                desc,
                category
            },
            {
                transaction
            }
        );

        await findUser.update(
            {
                totalAmount: updatedBalance
            },
            {
                transaction
            }
        );

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense,
            remainingBalance: updatedBalance
        });

    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            message: `Add expense error: ${error.message}`
        });
    }
};
const getExpense = async (req, res) => {
    try {
        const userId = req.user.userId
        const findUser = await userEntity.findByPk(userId, {
            attributes: [
                'userName',
                'userEmail',
                'isPrime',
                'totalAmount'
            ]
        })

        if (!userId || !findUser) {
            return res.status(404).send('userId not found')
        }
        const getData = await expenseEntity.findAll({
            where: {
                userId: userId,
                  isActive:true
            },
            order: [['createdAt', 'DESC']]
        })
        res.status(200).send({
            message: "All Expense list this user",
            reslt: getData,
            findUser
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

    const transaction = await sequelize.transaction();

    try {

        const eId = req.query.eId;

        if (!eId) {

            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Expense id is required"
            });
        }

        const findData = await expenseEntity.findOne({
            where: {
                id: eId,
                isActive: true
            },
            transaction
        });

        if (!findData) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        const findUser = await userEntity.findOne({
            where: {
                id: findData.userId
            },
            transaction
        });

        if (!findUser) {

            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const newBalance =
            Number(findUser.totalAmount || 0) +
            Number(findData.spentMoney);

        await expenseEntity.update(
            {
                isActive: false
            },
            {
                where: {
                    id: eId
                },
                transaction
            }
        );

        await findUser.update(
            {
                totalAmount: newBalance
            },
            {
                transaction
            }
        );

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
            currentBalance: newBalance
        });

    } catch (error) {

        await transaction.rollback();

        return res.status(500).json({
            success: false,
            message: `Delete expense error: ${error.message}`
        });
    }
};
module.exports = {
    addExpense,
    getExpense,
    editExpense,
    deleteExpense
}