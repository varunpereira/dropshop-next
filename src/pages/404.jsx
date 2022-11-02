
export default function component(props = null) {
  
  return (
    <div className="bg-black text-white">
      <h1 className="text-lg">404 error</h1>
    </div>
  )
}

export function getStaticProps({}) {
  return {
    props: {
      props: JSON.stringify({}),
    },
  }
}
