import connectDB from 'utils/connectDB'
import orderModel from 'models/orderModel'
import productModel from 'models/productModel'

connectDB()

export default async function patch(req, res) {
  try {
    let { email, productId, productPrice, productQuantity } = req.body
    // console.log(JSON.stringify(req.body))

    let updateProduct = await productModel.updateOne(
      { _id: productId },
      {
        $inc: { sold: -productQuantity, stock: productQuantity },
      }
    )
    let currentOrder = await orderModel.updateOne(
      { email: email, current: true },
      {
        $pull: { products: { productId: productId } },
        $inc: {
          price: -productPrice * productQuantity,
          quantity: -productQuantity,
        },
      }
    )
    if (currentOrder.modifiedCount === 0) {
      return res.json({ err: 'No current order found for that email.' })
    }
    res.json({ currentOrder: currentOrder })
    return
  } catch (err) {
    return res.json({ err: err.message })
  }
}
