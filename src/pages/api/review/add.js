import connectDB from 'utils/connectDB'
import reviewModel from 'models/reviewModel'

connectDB()

export default  async function post(req, res) {
  try {
    let { productId, email, rating, description } = req.body
    if (rating.trim().length === 0 || description.trim().length === 0) {
      return res.json({ err: 'Rating and Description required.' })
    }
    let save = await new reviewModel({
      productId,
      email,
      rating,
      description,
    }).save()
    if (!save) {
      return res.json({ error: 'Rating needs to be a number.' })
    }
    return res.json({ msg: 'success' })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
