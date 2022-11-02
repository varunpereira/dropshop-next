import Head from 'next/head'
import { useContext, useState, useEffect, Key } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { setGlobalState, getGlobalState } from 'utils/globalState'
import axios from 'axios'
import { TrashIcon } from '@heroicons/react/solid'
import getAuth from 'utils/getAuth'
import connectDB from 'utils/connectDB'

import orderModel from 'models/orderModel'

export default function component(props) {
  let {  cart } = JSON.parse(props.props)

  let [error, setError] = useState('')
  let router = useRouter()

  async function removeProductItem(productItem) {
    let productItemData = {
      email: getGlobalState('auth').user.email,
      productId: productItem.productId,
      productQuantity: productItem.productQuantity,
      productPrice: productItem.productPrice,
    }
    let res = await axios.post('/api/order/cart/setDec', productItemData)
    if (res.data.err) {
      console.log('error')
      return
    }
    setGlobalState('auth', {
      ...getGlobalState('auth'),
      cartQuantity:
        getGlobalState('auth').cartQuantity - productItem.productQuantity,
    })
    router.push(router.pathname)
  }

  async function handleCheckout() {
    //checkout
    if (cart.quantity <= 0) {
      setError('Cart empty. Please add a product.')
      return
    }
    let products = cart.products.map((productItem) => {
      return {
        name: productItem.productTitle,
        description: productItem.productId,
        // images: ['https://example.com/t-shirt.png'],
        amount: productItem.productPrice * 100,
        quantity: productItem.productQuantity,
        currency: 'aud',
      }
    })
    // console.log(JSON.stringify(products))
    let res = await axios.post('/api/stripe/checkoutSession', {
      orderId: cart._id,
      items: products,
    })
    router.push(res.data.url)
    // window.location = res.data.url
  }

  function productsList() {
    return (
      typeof cart.products !== 'undefined' &&
      cart.products.map((productItem) => (
        <div
          key={productItem.productId}
          className="-mx-8 flex items-center px-6 py-5 hover:bg-gray-100"
        >
          <div className="flex w-2/5">
            {/* <div className="w-20">
                        <img className="h-24" src="" alt="" />
                        </div> */}
            <div className="ml-4 flex flex-grow flex-col justify-between">
              <Link href={'/product?productId=' + productItem.productId}>
                <a className="flex hover:underline">
                  <span className="justify-start text-sm font-bold">
                    {productItem.productTitle +
                      ' (' +
                      productItem.productId +
                      ')'}
                  </span>
                </a>
              </Link>
            </div>
          </div>
          <div className="text-sm3 w-1/5 text-center font-semibold">
            <i className="fa fa-minus mr-3 font-thin" aria-hidden="true"></i>
            {productItem.productQuantity}
            <i className="fa fa-plus ml-3 font-thin" aria-hidden="true"></i>
          </div>
          <span className="w-1/5 text-center text-sm font-semibold">
            ${productItem.productQuantity * productItem.productPrice}
          </span>
          <a
            onClick={() => removeProductItem(productItem)}
            className="w-1/5 text-center text-sm font-semibold hover:text-red-600"
          >
            <TrashIcon className="h-5 w-5" />
          </a>
        </div>
      ))
    )
  }

  return (
    <div>
      <Head>
        <title>Cart</title>
      </Head>
      <div className="mx-auto my-10 rounded-lg bg-white text-black shadow-md">
        <div className="rounded-lg bg-white px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
            <h2 className="text-2xl font-semibold">{cart.quantity} Items</h2>
          </div>
          <div className="mt-10 mb-5 flex">
            <h3 className="w-2/5 text-xs font-semibold uppercase text-gray-600">
              Product Details
            </h3>
            <h3 className="w-1/5 text-center text-center text-xs font-semibold uppercase text-gray-600">
              Quantity
            </h3>
            <h3 className="w-1/5 text-center text-center text-xs font-semibold uppercase text-gray-600">
              Total
            </h3>
            <h3 className="w-1/5 text-center text-center text-xs font-semibold uppercase text-gray-600"></h3>
          </div>

          {productsList()}
        </div>

        <div id="summary" className="px-8 py-10">
          <h1 className="border-b pb-8 text-2xl font-semibold">
            Order Summary
          </h1>
          <div className="mt-10 mb-5 flex justify-between">
            <span className="text-sm font-semibold uppercase">
              Items {cart.quantity}
            </span>
            <span className="text-sm font-semibold">${cart.price}</span>
          </div>
          <div>
            <label className="mb-3 inline-block text-sm font-medium uppercase">
              Shipping
            </label>
            <select className="block w-full p-2 text-sm text-gray-600">
              <option>Standard shipping - Free</option>
            </select>
          </div>
          <div className="mt-8 border-t">
            <div className="flex justify-between py-6 text-sm font-semibold uppercase">
              <span>Total cost</span>
              <span>${cart.price}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full rounded bg-black py-3  text-sm font-semibold uppercase text-white hover:bg-gray-600"
            >
              Proceed to Payment
            </button>
            <div className="mt-10 text-red-500">{error} </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ query, req }) {
  let auth = await getAuth(req.cookies.refreshToken)
  if (auth.error || !req.cookies.refreshToken) {
    return {
      redirect: {
        destination: '/signin',
      },
    }
  }
  connectDB()

  let cart = await orderModel.findOne({
    email: auth.user.email,
    current: true,
  })

  return {
    props: { props: JSON.stringify({ auth, cart }) },
  }
}
