import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { setGlobalState, getGlobalState } from 'utils/globalState'
import axios from 'axios'
import cookie from 'js-cookie'
import connectDB from 'utils/connectDB'
 
import getAuth from 'utils/getAuth'


export default function component(props) {
  let {  } = JSON.parse(props.props)

  let [error, setError] = useState('')
  let router = useRouter()
  let [userData, setUserData] = useState({ email: '', password: '' })
  let { email, password } = userData

  function formInputs(e) {
    let { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  async function formSubmit(e) {
    e.preventDefault()
    try {
      let res = await axios.post('/api/user/signin', userData)
      if (res.data.err) {
        setError(res.data.err)
        return
      }

      setGlobalState('auth', {
        accessToken: res.data.accessToken,
        user: res.data.user,
        cartQuantity: res.data.cartQuantity,
      })

      cookie.set('refreshToken', res.data.refreshToken, {
        // path: '/api/user/getAccessToken',
        // 7 days
        expires: 7,
        secure: true,
        sameSite: 'strict',
      })

      router.push('/')
    } catch (resError) {
      console.log(resError)
    }
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className="container mx-auto flex max-w-sm flex-1 flex-col items-center justify-center px-2">
        <div className="w-full rounded bg-white px-6 py-8 text-black shadow-md">
          <h1 className="mb-8 text-center text-3xl">Sign in</h1>
          <form onSubmit={formSubmit}>
            <input
              name="email"
              value={email}
              onChange={formInputs}
              type="text"
              placeholder="Email"
              className="border-grey-light mb-4 block w-full rounded border p-3"
            />
            <input
              name="password"
              value={password}
              onChange={formInputs}
              type="password"
              placeholder="Password"
              className="border-grey-light mb-4 block w-full rounded border p-3"
            />
            <button
              type="submit"
              className="hover:bg-green-dark my-1 w-full rounded bg-black py-3 text-center text-white focus:outline-none"
            >
              Sign in
            </button>
          </form>
          <div className="mt-10 text-red-500">{error} </div>
        </div>

        <div className="text-grey-dark mt-6">
          {"Don't have an account? "}
          <Link href="/signup">
            <a className="border-blue text-blue border-b no-underline">
              Sign up
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query, req, res }) {
 
  if (req.cookies.refreshToken) {
    return {
      redirect: {
        destination: '/',
      },
    }
  }
  let auth = await getAuth(req.cookies.refreshToken)
  if (auth.error || !req.cookies.refreshToken) {
    // return {
    //   redirect: {
    //     ,
    //     destination: '/signin',
    //   },
    // }
  }

  return {
    props: {
      props: JSON.stringify({auth}),
    },
  }
}