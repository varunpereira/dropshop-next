import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { setGlobalState, getGlobalState } from 'utils/globalState'
import axios from 'axios'
import Cookie from 'js-cookie'
import connectDB from 'utils/connectDB'
import getAuth from 'utils/getAuth'


export default function component(props) {
  let {} = JSON.parse(props.props)

  let [productData, setProductData] = useState({
    email: 'test',
    title: 'test',
    description: 'test',
    price: 0,
    images: [
      {
        public_id: 'nextjs_media/nelvbtwdbk1vjvhufort',
        url: 'https://res.cloudinary.com/devatchannel/image/upload/v1605318911/nextjs_media/nelvbtwdbk1vjvhufort.jpg',
      },
    ],
    category: 'test',
    stock: 0,
    sold: 0,
  })
  let { email, title, description, price, images, category, stock, sold } =
    productData
  let [showError, setShowError] = useState('')
  let router = useRouter()

  function handleChangeInput(e) {
    let { name, value } = e.target
    setProductData({ ...productData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      productData = { ...productData, email: getGlobalState('auth').user.email }
      // console.log(JSON.stringify(productData))
      let res = await axios.post('/api/product/add', productData)
      if (res.data.err) {
        console.log(res.data.err)
        return
      }
      // console.log('res:' + JSON.stringify(res.data))
      router.push('/result?search=all')
    } catch (resError) {
      console.log(resError)
    }
  }

  return (
    <div>
      <Head>
        <title>Sell</title>
      </Head>
      <div className="container mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-2">
        <div className="w-full rounded bg-white  px-20 py-8 text-black shadow-md">
          <h1 className="mb-8 text-center text-3xl">Sell a Product</h1>
          <p>Title</p>
          <input
            name="title"
            value={title}
            onChange={handleChangeInput}
            type="text"
            className="border-grey-light mb-4 block w-full rounded border p-3"
          />
          <p>Description</p>
          <input
            name="description"
            value={description}
            onChange={handleChangeInput}
            type="text"
            className="border-grey-light mb-4 w-full rounded border p-3"
          />
          {/* <p>Category</p>
                    <input
                        name="category" value={category}
                        onChange={handleChangeInput} type="text"
                        className=" block border border-grey-light w-full p-3 rounded mb-4" /> */}
          <p>Price</p>
          <input
            name="price"
            value={price}
            onChange={handleChangeInput}
            type="text"
            className="border-grey-light mb-4 block w-full rounded border p-3"
          />
          <p>Stock</p>
          <input
            name="stock"
            value={stock}
            onChange={handleChangeInput}
            type="text"
            className="border-grey-light mb-4 block w-full rounded border p-3"
          />
          <p>Sold</p>
          <input
            name="sold"
            value={sold}
            onChange={handleChangeInput}
            type="text"
            className="border-grey-light mb-4 block w-full rounded border p-3"
          />
          {/* <p>Image Links</p>
                    <input
                        name="images" value={images}
                        onChange={handleChangeInput} type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4" /> */}
          <button
            onClick={handleSubmit}
            type="button"
            className="hover:bg-green-dark my-1 w-full rounded bg-black py-3 text-center text-white focus:outline-none"
          >
            Sell
          </button>
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

  return {
    props: { props: JSON.stringify({ auth: auth }) },
  }
}
