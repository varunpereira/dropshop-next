import connectDB from 'utils/connectDB'
import userModel from 'models/userModel'
import orderModel from 'models/orderModel'
import jwt from 'jsonwebtoken'

connectDB()

export default async function api(req, res) {
  try {
    let { email } = req.body

    let user = await userModel.findOne({ email: email })
    if (user === null) return res.json({ error: 'This user does not exist.' })

    let accessToken = jwt.sign(
      { id: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )

    let cart = await orderModel.findOne({
      email: user.email,
      current: true,
    })

    res.json({
      accessToken: accessToken,
      user: {
        email: user.email,
        role: user.role,
      },
      cartQuantity: cart.quantity,
    })
  } catch (error) {
    return res.json({ error: error.message })
  }
}
