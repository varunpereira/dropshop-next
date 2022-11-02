import connectDB from 'utils/connectDB'
import orderModel from 'models/orderModel'
import productModel from 'models/productModel'

connectDB()

export default async function patch(req, res) {
  try {
    let { email, product, productQuantity } = req.body
    // after validation
    let updateProduct = await productModel.updateOne(
      { _id: product._id },
      {
        $inc: { sold: productQuantity, stock: -productQuantity },
      }
    )
    let currentOrder = await orderModel.updateOne(
      {
        email: email,
        current: true,
        products: { $elemMatch: { productId: product._id } },
      },
      {
        $inc: {
          'products.$.productQuantity': productQuantity,
          price: product.price * productQuantity,
          quantity: productQuantity,
        },
      }
    )
    // console.log(JSON.stringify(currentOrder))
    if (currentOrder.modifiedCount === 0) {
      currentOrder = await orderModel.updateOne(
        { email: email, current: true },
        {
          $push: {
            products: {
              productId: product._id,
              productQuantity: productQuantity,
              productTitle: product.title,
              productPrice: product.price,
            },
          },
          $inc: {
            price: product.price * productQuantity,
            quantity: productQuantity,
          },
        }
      )
    }
    res.json({ currentOrder: currentOrder })
    return
  } catch (err) {
    return res.json({ err: err.message })
  }
}
