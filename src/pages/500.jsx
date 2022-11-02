export default function component(props) {
  return (
    <div className="bg-black text-white">
      <h1 className="text-lg">505 error</h1>
    </div>
  )
}

export async function getStaticProps({}) {
  return {
    props: {
      props: JSON.stringify({auth:null}),
    },
  }
}
