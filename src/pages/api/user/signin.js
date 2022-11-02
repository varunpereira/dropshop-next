import connectDB from 'utils/connectDB'
import userModel from 'models/userModel'
import orderModel from 'models/orderModel'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connectDB()

export default async function api(req, res) {
  try {
    let { email, password } = req.body

    let user = await userModel.findOne({ email: email })
    if (user === null) return res.json({ error: 'This user does not exist.' })

    let isMatch = bcryptjs.compareSync(password, user.password)
    if (!isMatch) {
      return res.json({ error: 'Incorrect password.' })
    }

    let accessToken = jwt.sign(
      { id: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )
    let refreshToken = jwt.sign(
      { id: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    let currentOrder = await orderModel.findOne({
      email: user.email,
      current: true,
    })

    res.json({
      refreshToken: refreshToken,
      accessToken: accessToken,
      user: {
        email: user.email,
        role: user.role,
      },
      cartQuantity: currentOrder.quantity,
    })
  } catch (error) {
    return res.json({ error: error.message })
  }
}
