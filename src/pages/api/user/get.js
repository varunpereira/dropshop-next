import connectDB from 'utils/connectDB'
import Users from 'models/userModel'

connectDB()

export default async function get(req, res) {
  try {
    let { id } = req.query
    let users = await Users.find({ email: id })
    if (users === null) {
      return res.json({ err: 'User does not exist.' })
    }
    return res.json({ users: users })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
