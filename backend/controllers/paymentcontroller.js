const cashfree = require('../config/cashfreeService')
const paymentEntity = require('../models/paymentEntity')
const userEntity = require('../models/userentity')

const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId
        const orderId = `ORDER_${userId}_${Date.now()}`
        const PREMIUM_PRICE = 99
        const expiryDate = new Date();
        expiryDate.setMinutes(
            expiryDate.getMinutes() + 30
        );
        await paymentEntity.create({
            userId,
            orderId,
            amount: PREMIUM_PRICE,
            status: "PENDING"
        })
        var request = {
            order_amount: PREMIUM_PRICE,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: String(userId),
                customer_phone: "9876543210",
            },
            order_meta: {
                return_url: "http://localhost:5000/expense.html?order_id={order_id}",
                payment_methods: "cc,dc,upi"
            },
            order_expiry_time: expiryDate.toISOString()
        }
        const response = await cashfree.PGCreateOrder(request)
        res.status(200).json({
            success: true,
            orderId,
            sessionId:
                response.data.payment_session_id

        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message
        });

    }
}

const verfyPayment = async (req, res) => {
    try {
        const { orderId } = req.params
        const response = await cashfree.PGOrderFetchPayments(
            orderId
        )
        const payments = response.data
        console.log(payments, "==============",response);

        let orderStatus = 'FAILED'
        if (payments.filter(
            payment =>
                payment.payment_status === 'SUCCESS'
        ).length > 0) {
            orderStatus = 'SUCCESS'
        } else if (payments.filter(payment =>
            payment.payment_status === 'PENDING'
        ).length > 0) { 
            orderStatus='PENDING'
        }
        await paymentEntity.update({
            status:orderStatus
        },{
            where:{
                orderId
            }
        })
        if(orderStatus==='SUCCESS'){
            const payment=await paymentEntity.findOne({
                where:{
                    orderId
                }
            })
            await userEntity.update({
                isPrime:true
            },{
                where:{
                    id:payment.userId
                }
            })
        }
        return res.status(200)
            .json({
                success: true,
                orderStatus,
            });
    } catch (error) {
          return res.status(500)
            .json({
                success: false,
                message: error.message
            });
    }
}
module.exports = {
    createOrder,
    verfyPayment
}