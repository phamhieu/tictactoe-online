import * as React from 'react'
import { observer } from 'mobx-react-lite'
import Auth from '../components/Auth'
import Layout from '../components/Layout'
import ProfileHeading from '../components/ProfileHeading'
import OnlinePlayers from '../components/OnlinePlayers'
import GameRules from '../components/GameRules'
import GameInvitations from '../components/GameInvitations'
import Loading from '../components/Loading'
import { StoreContext } from '../lib/store'

function Home() {
  const _store = React.useContext(StoreContext)
  return (
    <>
      <Layout>{_store.session ? <GameRoom /> : <Auth />}</Layout>
    </>
  )
}

export default observer(Home)

const GameRoom: React.FC = () => {
  return (
    <div className="">
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
                  <MyGames />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

const MyGames: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)

  React.useEffect(() => {
    _store.getGamesAsync()
  }, [])

  return (
    <>
      {_store.currentGame ? <CurrentGame /> : <GameInvitations />}
      <GameRules />
    </>
  )
})

const CurrentGame: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)
  const [loading, setLoading] = React.useState(false)

  const { id, from_id, to_id } = _store.currentGame ?? {}
  const from = _store.profiles.find((x) => x.id == from_id)
  const to = _store.profiles.find((x) => x.id == to_id)

  const handleCancel = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      setLoading(true)
      await _store.cancelInvitation(id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
      <div className="relative z-10 rounded-lg shadow-xl">
        <div
          className="pointer-events-none absolute inset-0 rounded-lg border-2 border-indigo-600"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-0 transform translate-y-px">
          <div className="flex justify-center transform -translate-y-1/2">
            <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white">
              Invitation
            </span>
          </div>
        </div>
        <div className="bg-white rounded-t-lg px-6 pt-12 pb-10">
          <div>
            <p className="relative grid grid-flow-col grid-cols-5">
              <span className="col-span-2 flex text-center justify-center">
                <span className="mt-2 text-base font-medium truncate">
                  {from?.username ?? 'Anonymous'}
                </span>
              </span>
              <span className="flex items-center justify-center font-extrabold text-3xl text-indigo-300">
                VS
              </span>
              <span className="col-span-2 flex text-center justify-center">
                <span className="mt-2 text-base font-medium truncate">
                  {to?.username ?? 'Anonymous'}
                </span>
              </span>
            </p>
          </div>
        </div>
        <div className="border-t-2 border-gray-100 rounded-b-lg pt-10 pb-8 px-6 bg-gray-50 sm:px-10 sm:py-10">
          <div className="w-full inline-flex items-center justify-center">
            <Loading className="text-blue-500" />
            <span className="text-gray-400">Waiting reply...</span>
          </div>
          <div className="mt-8">
            <button
              type="button"
              className="block w-full px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})
