import * as React from 'react'
import { observer } from 'mobx-react-lite'
import toast from 'react-hot-toast'
import Layout from '../components/Layout/Layout'
import ProfileHeading from '../components/Layout/ProfileHeading'
import OnlinePlayers from '../components/OnlinePlayers'
import GameRules from '../components/GameRules'
import GameInvitations from '../components/GameInvitations'
import CurrentGame from '../components/CurrentGame'
import Loading from '../components/Loading'
import { StoreContext } from '../lib/store'
import { supabase } from '../lib/supabaseClient'

function Home() {
  const _store = React.useContext(StoreContext)
  return <Layout>{_store.session ? <GameRoom /> : <Auth />}</Layout>
}

export default observer(Home)

const Auth: React.FC = () => {
  return (
    <>
      <div className="flex-shrink-0 flex justify-center">
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Tic Tac Toe online
        </h1>
      </div>
      <div className="mx-auto py-24">
        <div className="text-center">
          <p className="mt-2 text-base text-gray-500">
            Sign in with magic link to start playing with others
          </p>
          <MagicLinkForm />
        </div>
      </div>
    </>
  )
}

const MagicLinkForm: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')

  const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      toast.success('Check your email for the login link!')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action="#" className="mt-6 flex flex-col">
      <div className="w-full">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          type="text"
          name="email"
          id="email"
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter an email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={handleLogin}
      >
        {loading && <Loading />}
        Send magic link
      </button>
    </form>
  )
}

const GameRoom: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)
  return (
    <>
      <ProfileHeading />
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">Game Room</h1>
        {/* Main 3 column grid */}
        <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <div className="grid grid-cols-1 gap-4">
            <section aria-labelledby="section-1-title">
              <h2 className="sr-only" id="section-1-title">
                Online players
              </h2>
              <div className="rounded-lg bg-white overflow-hidden shadow">
                <div className="p-6">
                  <OnlinePlayers />
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            <section aria-labelledby="section-2-title">
              <h2 className="sr-only" id="section-2-title">
                My games
              </h2>
              <div className="rounded-lg bg-white overflow-hidden shadow">
                <div className="p-6">
                  {_store.currentGame ? <CurrentGame /> : <GameInvitations />}
                  <GameRules />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
})
