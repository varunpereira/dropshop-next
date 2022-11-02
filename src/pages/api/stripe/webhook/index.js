import Stripe from 'stripe'
import { buffer } from 'micro'

let stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

export let config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let event

    try {
      let stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27',
      })

      let rawBody = await buffer(req)
      let signature = req.headers['stripe-signature']

      event = stripe.webhooks.constructEvent(
        rawBody.toString(),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.log(`Error message: ${err.message}`)
      res.json({ message: `Webhook Error: ${err.message}` })
      return
    }

    // Successfully  event
    console.log('Success:', event.id)

    // Handle event type (add business logic here)
    if (event.type === 'checkout.session.completed') {
      console.log(`Payment received!`)
    } else {
      console.warn(`Unhandled event type: ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.json({ message: 'Method not allowed' })
  }
}
