import connectDB from 'utils/connectDB'
import Users from 'models/userModel'
import bcryptjs from 'bcryptjs'
import orderModel from 'models/orderModel'

connectDB()

export default async function post(req, res) {
  try {
    let { email, password, cf_password } = req.body

    let errMsg = valid(email, password, cf_password)
    if (errMsg) return res.json({ err: errMsg })

    let user = await Users.findOne({ email })
    if (user) return res.json({ err: 'This email already exists.' })

    let passwordHash = bcryptjs.hashSync(password, 12)

    let saveUser = await new Users({
      email: email,
      password: passwordHash,
    }).save()
    let saveCart = await new orderModel({
      email: email,
      current: true,
    }).save()

    res.json({ msg: 'Register Success!' })
  } catch (err) {
    return res.json({ err: err.message })
  }
}

function valid(email, password, cf_password) {
  if (!email || !password)
      return 'Please add all fields.'

  if (!validateEmail(email))
      return 'Invalid emails.'

  if (password.length < 6)
      return 'Password must be at least 6 characters.'

  if (password !== cf_password)
      return 'Confirm password did not match.'
}


function validateEmail(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
