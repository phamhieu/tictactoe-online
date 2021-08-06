import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import Loading from '../components/Loading'
import { StoreContext } from '../lib/store'
import { supabase } from '../lib/supabaseClient'
import { gameStatus } from '../lib/types'
import { runInAction } from 'mobx'
import { joinClassNames } from '../lib/helper'

const CurrentGame: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)

  const { id, from_id, to_id, status } = _store.currentGame ?? {}
  const from = _store.profiles.find((x) => x.id == from_id)
  const to = _store.profiles.find((x) => x.id == to_id)

  React.useEffect(() => {
    const mySubscription = supabase
      .from(`games:id=eq.${id}`)
      .on('UPDATE', (payload) => {
        console.log('New UPDATE received!', payload)
        const id = payload?.new?.id
        const updatedPayload = payload?.new
        if (id && updatedPayload) {
          _store.updateGame(id, updatedPayload)
          if (status == gameStatus.READY) {
            // Show game board
          }
        }
      })
      .subscribe()
    return () => {
      mySubscription.unsubscribe()
    }
  }, [])

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
          <CurrentGameStatus id={id} status={status} />
        </div>
      </div>
    </div>
  )
})
export default CurrentGame

type CurrentGameStatusProps = {
  id: string
  status: string
}
const CurrentGameStatus: React.FC<CurrentGameStatusProps> = observer(({ id, status }) => {
  const _store = React.useContext(StoreContext)
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleCancel = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      setLoading(true)
      await _store.cancelInvitation(id)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    runInAction(() => {
      _store.currentGame = null
      _store.games = _store.games.filter((x) => x.id != id)
    })
  }

  const handleStartGame = (e: React.MouseEvent<HTMLElement>) => {
    router.push(`/games/${id}`)
  }

  return (
    <>
      <div className="w-full inline-flex items-center justify-center">
        {status == gameStatus.WAITING && (
          <>
            <Loading className="text-blue-500" />
            <span className="text-gray-400">Waiting reply...</span>
          </>
        )}
        {status == gameStatus.DENY && (
          <span className="text-gray-400">Your invitation is DENIED</span>
        )}
        {status == gameStatus.READY && (
          <span className="text-gray-400">Your invitation is ACCEPTED</span>
        )}
      </div>
      <div className="mt-8">
        <button
          type="button"
          className={joinClassNames(
            status == gameStatus.READY
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            'block w-full px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 '
          )}
          onClick={
            status == gameStatus.READY
              ? handleStartGame
              : status == gameStatus.WAITING
              ? handleCancel
              : handleClose
          }
          disabled={loading}
        >
          {status == gameStatus.READY
            ? 'Start game'
            : status == gameStatus.WAITING
            ? 'Cancel'
            : 'Close'}
        </button>
      </div>
    </>
  )
})
