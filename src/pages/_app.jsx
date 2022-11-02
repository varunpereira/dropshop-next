import 'styles/global.css'
import NavBar from 'components/layout/navBar'
import Footer from 'components/layout/footer'
import getAuth from 'utils/getAuth'

export default function component({ Component, pageProps }) {
  let auth = JSON.parse(pageProps.props).auth

  return (
    <div>
      <NavBar auth={auth} />
      <Component {...pageProps} />
      <Footer />
    </div>
  )
}

export async function getServerSideProps({ query, req, res }) {
  let auth = await getAuth(req.cookies.refreshToken)
  return {
    props: {
      props: JSON.stringify({
        auth,
      }),
    },
  }
}
