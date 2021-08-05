import * as React from 'react'
import { observer } from 'mobx-react-lite'
import Auth from '../components/Auth'
import Layout from '../components/Layout'
import ProfileHeading from '../components/ProfileHeading'
import { StoreContext } from '../lib/store'
import { supabase } from '../lib/supabaseClient'

function Home() {
  const _store = React.useContext(StoreContext)
  return (
    <>
      <Layout>{_store.session ? <WaitingRoom /> : <Auth />}</Layout>
    </>
  )
}

export default observer(Home)

const WaitingRoom: React.FC = () => {
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
                Game status
              </h2>
              <div className="rounded-lg bg-white overflow-hidden shadow">
                <div className="p-6">
                  <div
                    style={{ height: '30rem', background: 'blue' }}
                    className="border-2 border-dashed border-gray-300 rounded-lg"
                  ></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

const OnlinePlayers: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)

  React.useEffect(() => {
    _store.getProfilesAsync()

    const mySubscription = supabase
      .from('presence_status')
      .on('INSERT', (payload) => {
        console.log('New INSERT received!', payload)
        const id = payload?.new?.id
        if (id) {
          _store.getProfileAsync(id)
        }
      })
      .on('UPDATE', (payload) => {
        console.log('New UPDATE received!', payload)
        const id = payload?.new?.id
        const status = payload?.new?.status
        if (id) {
          _store.updatePresenceStatus(id, status)
        }
      })
      .subscribe()
    return () => {
      mySubscription.unsubscribe()
    }
  }, [])

  return (
    <div className="flex flex-col">
      <div className="pb-5">
        <OnlineCounter />
      </div>
      <div className="max-h-80 overflow-y-scroll">
        <div className="flow-root mt-6">
          <PlayerList />
        </div>
      </div>
    </div>
  )
})

const OnlineCounter: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-500">
      <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
        <circle cx={4} cy={4} r={3} />
      </svg>
      {_store.onlineCount} Online
    </span>
  )
})

const PlayerList: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)

  return (
    <ul className="-my-5 divide-y divide-gray-200">
      {_store.sortedProfiles.length == 0 && (
        <li className="py-4">
          <div className="flex items-center space-x-4">
            <p className="mt-1 text-sm text-gray-500">Please wait for others to join.</p>
          </div>
        </li>
      )}
      {_store.sortedProfiles.map(({ id, avatar_url, username, status }) => (
        <PlayerListItem key={id} avatarUrl={avatar_url} online={status} username={username} />
      ))}
    </ul>
  )
})

type PlayerListItemProps = {
  avatarUrl?: string
  online: boolean
  username: string
}
const PlayerListItem: React.FC<PlayerListItemProps> = ({ avatarUrl, username, online }) => {
  return (
    <li key={username} className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-8 rounded-full"
            src={avatarUrl ?? 'https://via.placeholder.com/100'}
            alt="avatar image"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
          {online ? (
            <p className="text-sm text-blue-500 truncate">online</p>
          ) : (
            <p className="text-sm text-gray-500 truncate">offline</p>
          )}
        </div>
        <div className="pr-1">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!online}
          >
            Invite
          </button>
        </div>
      </div>
    </li>
  )
}
