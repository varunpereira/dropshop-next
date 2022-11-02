import Stripe from 'stripe'

let stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      let session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: req?.body?.items ?? [],
        // success_url: `${req.headers.origin}/cart/paymentSuccess`,
        success_url: `${req.headers.origin}/cart/paymentSuccess?orderId=${req.body.orderId}&checkoutSessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
      })
      res.json(session)
    } catch (err) {
      res.json({ message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.json({ message: 'Method not allowed' })
  }
}
