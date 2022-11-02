import Head from 'next/head'
import Image from 'next/image'
import getAuth from 'utils/getAuth'

export default function component(props) {
  let {  } = JSON.parse(props.props)

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <Image
        src="/homeBanner.png"
        alt="home_banner"
        width="100%"
        height="40%"
        layout="responsive"
      ></Image>
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

  // connectDB()

  // let products = await productModel.find({
  //   title: { $regex: query.search.trim(), $options: 'i' },
  // })

  return {
    props: {
      props: JSON.stringify({
        auth: auth,
      }),
    },
  }
}
