import connectDB from 'utils/connectDB'
import productModel from 'models/productModel'

connectDB()

export default async function get(req, res) {
  try {
    let { id } = req.query
    let products = await productModel.find({ email: id })
    if (products === null) {
      return res.json({ err: 'Products do not exist.' })
    }
    return res.json({ products: products })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
