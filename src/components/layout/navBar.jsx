import Link from 'next/link'
import { setGlobalState, getGlobalState } from 'utils/globalState'
import cookie from 'js-cookie'
import { useRouter } from 'next/router'
import SearchBar from 'components/layout/searchBar'
import { useEffect, useState } from 'react'
import {
  MenuIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from '@heroicons/react/solid'

export default function component(props) {
  const [hideNav, setHideNav] = useState(false)
  let router = useRouter()
  let [auth, setAuth] = useState({})

  // first render
  useEffect(() => {
    setAuth(props.auth)
  }, [])

  // whenever sibling components update global state
  useEffect(() => {
    setGlobalState('auth', getGlobalState('auth'))
  }, [getGlobalState('auth')])

  function handleAccountList(e) {
    e.preventDefault()
    if (e.target.value === 'signOut') {
      handleSignOut()
    } else if (e.target.value === 'profile') {
      router.push('/account/profile?email=' + getGlobalState('auth').user.email)
    } else if (e.target.value === 'contacts') {
      router.push('/account/messages/contacts')
    } else if (e.target.value === 'info') {
      router.push('/account/info')
    } else if (e.target.value === 'payments') {
      router.push('/account/payments')
    } else if (e.target.value === 'sales') {
      router.push('/account/sales')
    } else if (e.target.value === 'reviews') {
      router.push('/account/reviews')
    }
  }

  function handleSignOut() {
    cookie.remove('refreshToken')
    setGlobalState('auth', {})
    router.push('/')
    return
  }

  function signedInNavBar() {
    return (
      <>
        <li className="nav-item mr-5">
          <Link href="/product/sell">
            <a className="block py-2  no-underline hover:text-gray-400 ">
              Sell
            </a>
          </Link>
        </li>
        <li className="nav-item mr-3">
          <Link href={'/cart'}>
            <a className="block flex py-2  no-underline hover:text-gray-400 md:border-none md:p-0">
              <ShoppingCartIcon className="h-5 w-5" />
              <sup className="justtify-end font-bold">
                {getGlobalState('auth').user ? getGlobalState('auth').cartQuantity: auth.cartQuantity}
              </sup>
            </a>
          </Link>
        </li>
        <div className="nav-item flow-root">
          <div className="rounded hover:font-medium hover:text-gray-400 md:mx-2">
            <select
              className="custom-select text-capitalize bg-black"
              onChange={handleAccountList}
              value=""
            >
              <option hidden>{getGlobalState('auth').user ? getGlobalState('auth').user.email : auth.user.email}</option>
              <option value="profile">Profile</option>
              <option value="contacts">Contacts</option>
              <option value="info">Account</option>
              <option value="payments">Payments</option>
              <option value="sales">Sales</option>
              <option value="reviews">Reviews</option>
              <option value="signOut">Sign Out</option>
            </select>
          </div>
        </div>
      </>
    )
  }

  return (
    <header className="relative mb-10 min-w-min bg-black py-4  shadow-lg md:flex md:items-center md:justify-between">
      <div className=" mb-3 flex items-center justify-between ">
        <h1 className="mr-5 pt-1 text-xl">
          <Link href="/">
            <a className="flex font-bold no-underline hover:text-gray-400">
              <ShoppingBagIcon className="h-7 w-7 " />
              <span className="justify-end">dropshop </span>
              {/* {JSON.stringify(auth)} */}
            </a>
          </Link>
        </h1>
        <button>
          <MenuIcon
            className="mt-2 h-7 w-7 hover:text-gray-400 md:hidden"
            onClick={() => setHideNav(!hideNav)}
          />
        </button>
      </div>
      {/* !hideNav */}
      {true && (
        <>
          <SearchBar />
          <ul className=" list-reset md:flex md:items-center">
            {getGlobalState('auth').user || auth.user ? (
              signedInNavBar()
            ) : (
              <li className="nav-item">
                <Link href="/signin">
                  <a className="py-2 hover:text-gray-400">
                    <span className="pr-1">Sign</span>in
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </>
      )}
    </header>
  )
}
