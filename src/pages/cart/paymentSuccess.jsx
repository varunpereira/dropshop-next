import { redirect } from 'next/dist/server/api-utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import getAuth from 'utils/getAuth'
import { setGlobalState, getGlobalState } from 'utils/globalState'
import cookie from 'js-cookie'
import jwt from 'jsonwebtoken'
import axios from 'axios'

export default function component() {
//   // let { checkoutSessionId, cartPaid,  } = JSON.parse(props.props)
//   let router = useRouter()
  let[alreadyPaid, setAlreadyPaid] = useState(false)

//   useEffect(() => {
//     if (!cookie.get('refreshToken')) {
//       router.push('/signin')
//     }
//     let result = jwt.verify(
//       cookie.get('refreshToken'),
//       process.env.REFRESH_TOKEN_SECRET
//     )
//     if (!result) {
//       router.push('/signin')
//     }
//     let axiosPost = async () => {
//       // put auth db in rem endpoint too
//       // let res1 = await axios.post('/api/order/cart/rem', {
//       //   email: result.id,
//       //   orderId: router.query.orderId,
//       //   checkoutSessionId: router.query.checkoutSessionId,
//       // })
//       // if (!res1.data.ok) {
//       //   setAlreadyPaid(true)
//       //   return
//       // }
//       // let res = await axios.post('/api/user/getAuth', {email:result.id})
//       // if (res.data.err) {
//       //   setError(res.data.err)
//       //   return
//       // }
//       // setGlobalState('auth', {
//       //   accessToken: res.data.accessToken,
//       //   user: res.data.user,
//       //   cartQuantity: res.data.cartQuantity,
//       // })
//     }
//     axiosPost()
//   }, [])

  return (
    <div>
      <Head>
        <title>Payment Success</title>
      </Head>
      {/* {cookie.get('refreshToken')} */}
      {!alreadyPaid ? (
        <div className="rounded-lg bg-white pl-2 text-black">
          <h1 className="text-2xl font-semibold">Payment Success!</h1>
          <p>Check your email for the receipt.</p>
        </div>
      ) : (
        <div className="rounded-lg bg-white pl-2 text-black">
          <h1 className="text-2xl font-semibold">Link expired</h1>
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps({
}) {
  // let auth = await getAuth(req.cookies.refreshToken)
  // if (auth.error || !req.cookies.refreshToken) {
  //   // return {
  //   //   redirect: {
  //   //     destination:
  //   //       '/cart/paymentSuccess?checkoutSessionId=' + checkoutSessionId,
  //   //   },
  //   // }
  // }
  // connectDB()
  //check if alrdy  cart paid
  // let cartPaid = await orderModel.findOne({
  //   email: auth.user.email,
  //   current: false,
  //   checkoutSessionId: checkoutSessionId,
  // })
  // if (cartPaid === null) {
  //   // update cart to paid + add csId
  //   let cartPay = await orderModel.updateOne(
  //     { email: auth.user.email, current: true },
  //     {
  //       current: false,
  //       checkoutSessionId: checkoutSessionId,
  //     }
  //   )
  //   // create new cart
  //   let cartNew = await new orderModel({
  //     email: auth.user.email,
  //     current: true,
  //   }).save()
  // }

  return {
    props: {
      props: JSON.stringify({
        auth:{},
        // checkoutSessionId,
      }),
    },
  }
}
