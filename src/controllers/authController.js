import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import TransactionModel from "../models/transactionModel.js";

export const signUpAction = async (req, res) => {
    const midtransUrl = process.env.MIDTRANS_URL
    const midtransAuthString = process.env.MIDTRANS_AUTH_STRING

    try {
        const body = req.body; // name, email, password
        const hashPassword = bcrypt.hashSync(body.password, 12); // Hash the password with bcrypt
        const user = new userModel({
            name : body.name,
            email : body.email,
            photo : "default.png",
            password : hashPassword,
            role : "manager",
        })

        // action payment gateway midtrans
        const transaction = new TransactionModel({
            user: user._id,
            price: 100000,
        });

        const midtrans = await fetch(midtransUrl, {
            method: "POST",
            body: JSON.stringify({
                    transaction_details: {
                        order_id: transaction._id.toString(),
                        gross_amount: transaction.price,
                    },
                    credit_card:{
                        secure : true
                    },
                    customer_details: {
                        email: user.email,
                    },
                    callbacks: {
                        finish: 'http://localhost:5173/success-checkout',

                    }
            }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Basic ${midtransAuthString}`,
            }
        });

        const resMidtrans = await midtrans.json(); 

        await user.save();
        await transaction.save();

        return res.json({
            message : 'Sign Up Success',
            data: {
                midtrans_payment_url: resMidtrans.redirect_url,
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}