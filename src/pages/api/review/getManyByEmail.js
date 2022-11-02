import connectDB from 'utils/connectDB'
import reviewModel from 'models/reviewModel'

connectDB()

export default async (req, res) => {
  if (req.method == 'GET') {
    await get(req, res)
  }
}

async function get(req, res) {
  try {
    let { id } = req.query
    let reviews = await reviewModel.find({ email: id })
    if (reviews === null) {
      return res.json({ err: 'Reviews do not exist.' })
    }
    return res.json({ reviews: reviews })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
