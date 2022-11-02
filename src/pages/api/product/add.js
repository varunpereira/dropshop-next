
import connectDB from 'utils/connectDB'
import productModel from 'models/productModel'

connectDB()



export default async function post(req, res) {
  try {
    let data = req.body
    let save = await new productModel(data).save()
    res.json({ msg: 'success' })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
