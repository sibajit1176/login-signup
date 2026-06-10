const creditLogEntity = require("../models/creditlogEntity");
const sequelize = require("../models/db");
const UserEntity = require("../models/userentity");

const addWaletBalance = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const userId = req.user.userId;
        const { creditForm, desc, amount } = req.body;

        const findUser = await UserEntity.findOne({
            where: {
                id: userId
            },
            transaction
        });

        if (!findUser) {

            await transaction.rollback();

            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        await creditLogEntity.create(
            {
                userId,
                creditForm,
                desc,
                amount
            },
            {
                transaction
            }
        );

        const updatedBalance =
            Number(findUser.totalAmount || 0) +
            Number(amount);

        await findUser.update(
            {
                totalAmount: updatedBalance
            },
            {
                transaction
            }
        );

        await transaction.commit();

        return res.status(200).send({
            success: true,
            message: "Balance updated successfully",
            totalAmount: updatedBalance
        });

    } catch (error) {

        await transaction.rollback();

        return res.status(500).send({
            success: false,
            message: `addWaletBalance error: ${error.message}`
        });
    }
};

module.exports = {
    addWaletBalance
};