import Layout from '../components/Layout'
import Board from '../components/Board'

export default function Home() {
  return (
    <Layout>
      <div className="max-w-sm max-h-96 w-screen h-screen m-auto">
        <Board />
      </div>
    </Layout>
  )
}
