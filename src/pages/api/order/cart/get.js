import connectDB from 'utils/connectDB'
import orderModel from 'models/orderModel'
import productModel from 'models/productModel'

connectDB()

export default async function get(req, res) {
  try {
    let { id } = req.query
    let cart = await orderModel.findOne({ email: id, current: true })
    if (cart === null) {
      // console.log(cart)
      return res.json({ err: 'No current order found for that email.' })
    }
    res.json({ cart: cart })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
