import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../lib/store'
import { supabase } from '../lib/supabaseClient'
import { runInAction } from 'mobx'

const GameInvitations: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)

  React.useEffect(() => {
    _store.getGamesAsync()

    const mySubscription = supabase
      .from(`games:to_id=eq.${_store.user?.id}`)
      .on('INSERT', (payload) => {
        console.log('New INSERT received!', payload)
        const id = payload?.new?.id
        const insertedPayload = payload?.new
        if (id && insertedPayload) {
          runInAction(() => {
            _store.games.push(insertedPayload)
          })
        }
      })
      .subscribe()
    return () => {
      mySubscription.unsubscribe()
    }
  }, [])

  return <InvitationsList />
})

export default GameInvitations

const InvitationsList: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)
  return (
    <ul className="divide-y divide-gray-200">
      {_store.games.length == 0 && (
        <li className="py-4">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">No game available</h2>
            <p className="mt-1 text-sm text-gray-500">Please invite other to a 1vs1 game.</p>
          </div>
        </li>
      )}
      {_store.gameInvitations.map((x) => (
        <InvitationItem key={x.id} id={x.id} fromId={x.from_id} />
      ))}
    </ul>
  )
})

type InvitationItemProps = {
  id: string
  fromId: string
}
const InvitationItem: React.FC<InvitationItemProps> = observer(({ id, fromId }) => {
  const _store = React.useContext(StoreContext)
  const [loading, setLoading] = React.useState(false)
  const from = _store.profiles.find((x) => x.id == fromId)

  const handleAccept = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      setLoading(true)
      await _store.replyInvitation(id, true)
    } finally {
      setLoading(false)
    }
  }

  const handleDeny = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      setLoading(true)
      await _store.replyInvitation(id, false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <li>
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <p className="text-sm font-medium truncate">
            <span className="text-indigo-600">{from?.username ?? 'Anonymous'}</span>
            <span>{` invites you to a 1vs1 game`}</span>
          </p>
        </div>
        <div className="space-x-4">
          <button
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={handleAccept}
            disabled={loading}
          >
            Accept
          </button>
          <button
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleDeny}
            disabled={loading}
          >
            Deny
          </button>
        </div>
      </div>
    </li>
  )
})
