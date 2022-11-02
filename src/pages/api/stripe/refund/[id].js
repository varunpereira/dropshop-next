import Stripe from 'stripe'
import connectDB from 'utils/connectDB'
import orderModel from 'models/orderModel'

connectDB()

let stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

export default async function handler(req, res) {
  let id = req.query.id
  try {
    if (!id.startsWith('cs_')) {
      throw Error('Incorrect Checkout Session ID.')
    }
    let checkout_session = await stripe.checkout.sessions.retrieve(id)
    let refund = await stripe.refunds.create({
      payment_intent: String(checkout_session.payment_intent),
    })

    let updateCart = await orderModel.updateOne(
      { checkoutSessionId: id, current: false },
      {
        $set: {
          refunded: true,
        },
      }
    )

    res.json({ refunded: refund })
  } catch (err) {
    res.json({ statusCode: 500, message: err.message })
  }
}
