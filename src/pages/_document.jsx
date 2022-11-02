import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" >
        <Head>
          <meta name="description" content="dropshop" />
          <link
            href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css"
            rel="stylesheet"
          ></link>
          <link rel="icon" href="/favicon.gif" />
        </Head>
        <body className="bg-black px-5 sm:px-10 md:px-20 text-white font-sans mx-auto">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
