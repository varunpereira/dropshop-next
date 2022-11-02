import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import axios from 'axios'

import productModel from 'models/productModel'
import reviewModel from 'models/reviewModel'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useContext, useEffect } from 'react'
import connectDB from 'utils/connectDB'
import getAuth from 'utils/getAuth'
import { setGlobalState, getGlobalState } from 'utils/globalState'

export default function DetailProduct(props) {
  let { product, reviews } = JSON.parse(props.props)

  let [tab, setTab] = useState(0)
  let [error, setError] = useState('')
  let router = useRouter()
  let [orderQuantity, setOrderQuantity] = useState(1)

  function addToCart(productItem) {
    if (!getGlobalState('auth').user) {
      router.push('/signin')
      return
    }
    if (orderQuantity < 1 || orderQuantity > product.stock) {
      setError('Quantity not available from current stock levels.')
      return
    }
    axios
      .post('/api/order/cart/setInc', {
        email: getGlobalState('auth').user.email,
        product: productItem,
        productQuantity: orderQuantity,
      })
      .then((res) => {
        setGlobalState('auth', {
          ...getGlobalState('auth'),
          cartQuantity: getGlobalState('auth').cartQuantity + orderQuantity,
        })
        router.push(router.pathname + '?productId=' + router.query.productId)
      })
  }

  function handleOrderQuantityMinusClick(e) {
    e.preventDefault()
    if (orderQuantity >= 2) {
      setOrderQuantity(orderQuantity - 1)
    }
  }

  function handleOrderQuantityPlusClick(e) {
    e.preventDefault()
    if (orderQuantity < product.stock) {
      setOrderQuantity(orderQuantity + 1)
    }
  }

  function handleOrderQuantityChange(e) {
    e.preventDefault()
    let qty = Number(e.target.value.trim())
    if (isNaN(qty)) {
      setError('Quantity can only be natural number.')
      return
    }
    setOrderQuantity(qty)
  }

  function leftArrow() {
    if (tab - 1 >= 0) {
      setTab(tab - 1)
      return
    }
    setTab(product.images.length - 1)
  }

  function rightArrow() {
    if (tab + 1 < product.images.length) {
      setTab(tab + 1)
      return
    }
    setTab(0)
  }

  return (
    <div className="">
      <Head>
        <title>Product Details</title>
      </Head>
      <div className=" items-start justify-center py-12 md:flex ">
        {product.images && (
          <div className="relative">
            <img
              className="w-full rounded-lg"
              src={product.images[tab].url}
              alt={product.images[0].url}
            />
            <button
              className="absolute bottom-20 left-0"
              type="button"
              onClick={() => leftArrow()}
            >
              <ChevronLeftIcon className="h-10 w-10" />
            </button>
            <button
              className="absolute bottom-20 right-0"
              type="button"
              onClick={() => rightArrow()}
            >
              <ChevronRightIcon className="h-10 w-10" />
            </button>
            {/* <div className="mt-3 flex items-center justify-between space-x-4 md:space-x-0">
              {product.images.map((img, index) => (
                <a className="hover:bg-gray">
                  <img
                    key={index}
                    src={img.url}
                    alt={img.url}
                    className="m-1 h-32 w-32 rounded-lg"
                    onClick={() => setTab(index)}
                  />
                </a>
              ))}
            </div> */}
          </div>
        )}
        <div className="mt-6 md:ml-6 md:mt-0 md:w-1/2 lg:ml-8 xl:w-2/5">
          <div className="border-gray-200 pb-6">
            <h1 className="text-xl font-semibold leading-7 lg:text-2xl lg:leading-6">
              {product.title}
            </h1>
          </div>
          <a href="#reviews" className="hover:text-gray-400 ">
            View Reviews
          </a>
          <div>
            <p className="mb-5 mt-5">Description: {product.description}</p>
            <p className="">Price: ${product.price}</p>
            <p className="">Sold: {product.sold}</p>
            <p className="">In Stock: {product.stock}</p>
            <p className="">
              Seller:{' '}
              <Link href={'/account/profile?email=' + product.email}>
                <a className="hover:text-gray-400">{product.email}</a>
              </Link>
            </p>
          </div>
          <div className="mt-5 mb-3">
            <i
              onClick={handleOrderQuantityMinusClick}
              className="fa fa-minus font-thin"
              aria-hidden="true"
            ></i>
            <input
              onChange={handleOrderQuantityChange}
              value={orderQuantity}
              className="mx-2 w-10 rounded text-center text-black"
              type="text"
            ></input>
            <i
              onClick={handleOrderQuantityPlusClick}
              className="fa fa-plus font-thin"
              aria-hidden="true"
            ></i>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="mt-5 flex w-full items-center justify-center rounded bg-white py-4 text-black hover:bg-gray-400"
          >
            Add to Cart
          </button>
          <div className="mt-10 text-red-500">{error} </div>
        </div>
      </div>
      <div id="reviews" className="-mx-1 mt-5 flex flex-wrap lg:-mx-4">
        {reviews.length === 0 ? (
          <h2>No Reviews</h2>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="mr-10 mb-10 h-40 w-40 max-w-sm rounded-lg border border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <h5 className="mb-2  font-bold tracking-tight text-gray-900 dark:text-white">
                <Link href={'/account/profile?email=' + review.email}>
                  <a className="hover:text-gray-600">{review.email}</a>
                </Link>
              </h5>
              <h5 className="mb-2  font-bold tracking-tight text-gray-900 dark:text-white">
                {' '}
                {review.rating} / 5 stars
              </h5>
              <p className="mb-3 min-h-full text-xs font-normal text-gray-700 dark:text-gray-400">
                {review.description}
              </p>
            </div>
          ))
        )}
      </div>

      {/* <div id="reviews">
        <h1 className="mb-5 mt-20 text-xl font-semibold leading-7 lg:text-2xl lg:leading-6">
          Reviews
        </h1>
        <Link href={'/product/addReview?productId=' + product._id}>
          <a className="text-xl font-semibold hover:text-gray-400">
            Add a Review
          </a>
        </Link>
        <div className="products mt-5 w-full">
          {reviews.length === 0 ? (
            <h2>No Reviews</h2>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="mr-10 mb-10 max-w-sm rounded-lg border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <Link href={'/account/profile?email=' + review.email}>
                    <a className="hover:text-gray-400">{review.email}</a>
                  </Link>
                </h5>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {' '}
                  {review.rating} / 5 stars
                </h5>
                <p className="mb-3 h-32 min-h-full font-normal text-gray-700 dark:text-gray-400">
                  {review.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div> */}
    </div>
  )
}

export async function getServerSideProps({ query, req }) {
  let auth = await getAuth(req.cookies.refreshToken)
  if (auth.error || !req.cookies.refreshToken) {
    // return {
    //   redirect: {
    //     ,
    //     destination: '/signin',
    //   },
    // }
  }
  connectDB()

  let product = await productModel.findOne({
    _id: query.productId,
  })
  let reviews = await reviewModel.find({
    productId: query.productId,
  })

  return {
    props: { props: JSON.stringify({ auth, reviews, product }) },
  }
}
