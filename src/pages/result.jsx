import { setGlobalState, getGlobalState } from 'utils/globalState'
import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import ProductItem from 'components/product/item'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import productModel from 'models/productModel'
import connectDB from 'utils/connectDB'
import getAuth from 'utils/getAuth'

export default function component(props) {
  let { products } = JSON.parse(props.props)

  let router = useRouter()

  return (
    <>
      <Head>
        <title>Result</title>
      </Head>

      <div className="flex flex-wrap text-white">
        {products.length === 0 ? (
          <h2>No Products found.</h2>
        ) : (
          products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))
        )}
      </div>
    </>
  )
}

export async function getServerSideProps({ query, req, res }) {
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

  if (!query.search) {
    query.search = ''
  }

  let products = await productModel.find({
    title: { $regex: query.search.trim(), $options: 'i' },
  })

  return {
    props: {
      props: JSON.stringify({
        auth,
        products,
      }),
    },
  }
}
