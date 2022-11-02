import connectDB from 'utils/connectDB'
import reviewModel from 'models/reviewModel'

connectDB()

export default  async function get(req, res) {
  try {
    let { id } = req.query
    let reviews = await reviewModel.find({ productId: id })
    if (reviews === null) {
      return res.json({ err: 'Reviews do not exist.' })
    }
    return res.json({ reviews: reviews })
  } catch (err) {
    return res.json({ err: err.message })
  }
}


