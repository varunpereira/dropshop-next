import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { setGlobalState, getGlobalState } from 'utils/globalState'
import axios from 'axios'
import cookie from 'js-cookie'

import getAuth from 'utils/getAuth'

export default function component(props) {
  let {} = JSON.parse(props.props)

  let [userData, setUserData] = useState({
    email: '',
    password: '',
    cf_password: '',
  })
  let { email, password, cf_password } = userData
  let [error, setError] = useState('')
  let router = useRouter()

  function handleChangeInput(e) {
    let { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      let res1 = await axios.post('/api/user/signup', userData)
      if (res1.data.err) {
        setError(res1.data.err)
        return
      }
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
    <div className="bg-grey-lighter flex flex-col">
      <Head>
        <title>Sign up</title>
      </Head>
      <div className="container mx-auto flex max-w-sm flex-1 flex-col items-center justify-center px-2">
        <div className="w-full rounded bg-white px-6 py-8 text-black shadow-md">
          <h1 className="mb-8 text-center text-3xl">Sign up</h1>
          <input
            name="email"
            value={email}
            onChange={handleChangeInput}
            type="email"
            className="border-grey-light mb-4 block w-full rounded border p-3"
            placeholder="Email"
          />

          <input
            value={password}
            onChange={handleChangeInput}
            type="password"
            className="border-grey-light mb-4 block w-full rounded border p-3"
            name="password"
            placeholder="Password"
          />
          <input
            name="cf_password"
            value={cf_password}
            onChange={handleChangeInput}
            type="password"
            className="border-grey-light mb-4 block w-full rounded border p-3"
            placeholder="Confirm Password"
          />

          <button
            onClick={handleSubmit}
            type="button"
            className="hover:bg-green-dark my-1 w-full rounded bg-black py-3 text-center text-white focus:outline-none"
          >
            Sign up
          </button>

          <div className="mt-10 text-red-500">{error} </div>
        </div>

        <div className="text-grey-dark mt-6">
          {'Already have an account? '}
          <Link href="/signin">
            <a className="border-blue text-blue border-b no-underline">
              Sign in
            </a>
          </Link>
        </div>
      </div>
    </div>
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
      props: JSON.stringify({auth,}),
    },
  }
}
