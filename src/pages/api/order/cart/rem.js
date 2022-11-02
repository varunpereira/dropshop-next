import orderModel from 'models/orderModel'
import connectDB from 'utils/connectDB'

connectDB()

export default async function endpoint(req, res) {
  try {
    let { email, checkoutSessionId, orderId } = req.body
    let cartPaid = await orderModel.findOne({
      // email: email,
      current: false,
      _id: orderId,
      // checkoutSessionId: checkoutSessionId,
    })
    if (cartPaid) {
      return res.json({ ok: false })
    }
    // user can only know order id on success page
    let cartExists = await orderModel.findOne({
      // email: email,
      current: true,
      _id: orderId,
      // checkoutSessionId: checkoutSessionId,
    })
    if (!cartExists) {
      return res.json({ ok: false })
    }
    // update cart to paid + add csId
    let cartPay = await orderModel.updateOne(
      { _id: orderId, current: true },
      {
        current: false,
        checkoutSessionId: checkoutSessionId,
      }
    )
    // create new cart
    let cartNew = await new orderModel({
      email: email,
      current: true,
    }).save()
    return res.json({ ok: true })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
