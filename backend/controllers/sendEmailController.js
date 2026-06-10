const crypto = require('crypto')
const redisClient = require('../config/redis')
const transporter = require('../config/mailservice')
const userEntity = require('../models/userentity')
const bcrypt = require('bcrypt')

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userEntity.findOne({
            where: {
                userEmail: email
            }
        })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        const otp = crypto.randomInt(
            100000, 999999
        );
        await redisClient.set(
            `otp:${email}`,
            otp,
            'EX',
            300
        )
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <h2>Password Reset OTP</h2>
                <h3>${otp}</h3>
                <p>Valid for 5 minutes.</p>
            `
        })
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            email:email
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error
        });

    }
}
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!otp) {
            res.status(404).send({
                message: "Otp required"
            })
        }
        const storeOtp = await redisClient.get(`otp:${email}`)
        if (!storeOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found"
            });
        }
        if (storeOtp !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        await redisClient.del(`otp:${email}`)
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
const updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({
                message: "email and password required"
            })
        }
        const finduser = await userEntity.findOne({
            where: {
                userEmail: email
            }
        })
        if (!finduser) {
            return res.status(404).send({
                message: "User not find"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await finduser.update({
            password: hashPassword
        })
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    sendOtp,
    verifyOtp,
    updatePassword
}