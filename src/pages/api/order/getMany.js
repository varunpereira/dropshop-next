import connectDB from 'utils/connectDB'
import orderModel from 'models/orderModel'

connectDB()

export default async function get(req, res) {
  try {
    let { id } = req.query
    let orders = await orderModel.find({ email: id, current: false })
    if (orders === null) {
      return res.json({ err: 'Orders do not exist.' })
    }
    return res.json({ orders: orders })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
