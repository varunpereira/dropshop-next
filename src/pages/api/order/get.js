import connectDB from 'utils/connectDB'
import orderModel from 'models/orderModel'

connectDB()

export default async function endpoint(req, res) {
  try {
    let { id } = req.query
    let order = await orderModel.findById(id)
    if (order === null) {
      return res.json({ err: 'Orders do not exist.' })
    }
    return res.json({ order: order })
  } catch (err) {
    return res.json({ err: err.message })
  }
}


