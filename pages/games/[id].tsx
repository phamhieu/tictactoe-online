import * as React from 'react'
import { useRouter } from 'next/router'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { CheckIcon, ThumbUpIcon, UserIcon } from '@heroicons/react/solid'
import Layout from '../../components/Layout/Layout'
import Board from '../../components/Game/Board'
import ProfileHeading from '../../components/Layout/ProfileHeading'
import { joinClassNames } from '../../lib/helper'
import { StoreContext } from '../../lib/store'
import GameStore, { IGameStore } from '../../lib/gameStore'

export const GameStoreContext = React.createContext<IGameStore>(undefined!)

export default function GameBoard() {
  const _store = React.useContext(StoreContext)
  const _gameStore = useLocalObservable(() => new GameStore(_store))
  const router = useRouter()
  const { id } = router.query

  React.useEffect(() => {
    if (id) {
      _gameStore.getGameAsync(id as string)
      _gameStore.getGameMovesAsync(id as string)
    }
  }, [id])

  return (
    <GameStoreContext.Provider value={_gameStore}>
      <Layout>
        <ProfileHeading backtoHome={true} />
        <div className="max-w-sm max-h-96 w-screen h-screen mx-auto my-8">
          <Board />
        </div>
        <div className="pb-12 space-y-8">
          <CurrentMoveLabel />
          <GameMoveFeed />
        </div>
      </Layout>
    </GameStoreContext.Provider>
  )
}

const CurrentMoveLabel: React.FC = observer(() => {
  const _gameStore = React.useContext(GameStoreContext)
  return (
    <>
      {_gameStore.isEnded ? (
        <div className="text-center">
          {_gameStore.isDraw
            ? "No Winner! It's a Draw!"
            : `The game ENDED. The winner is ${_gameStore.winner?.username ?? 'Anonymous'}`}
        </div>
      ) : (
        <div className="text-center">
          {_gameStore.isMyTurn ? <p>It's your turn</p> : <p>It's the other turn</p>}
        </div>
      )}
    </>
  )
})

const timeline = [
  {
    id: 1,
    content: 'Applied to',
    target: 'Front End Developer',
    href: '#',
    date: 'Sep 20',
    datetime: '2020-09-20',
    icon: UserIcon,
    iconBackground: 'bg-gray-400',
  },
  {
    id: 2,
    content: 'Advanced to phone screening by',
    target: 'Bethany Blake',
    href: '#',
    date: 'Sep 22',
    datetime: '2020-09-22',
    icon: ThumbUpIcon,
    iconBackground: 'bg-blue-500',
  },
  {
    id: 3,
    content: 'Completed phone screening with',
    target: 'Martha Gardner',
    href: '#',
    date: 'Sep 28',
    datetime: '2020-09-28',
    icon: CheckIcon,
    iconBackground: 'bg-green-500',
  },
]
const GameMoveFeed: React.FC = () => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timeline.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={joinClassNames(
                      event.iconBackground,
                      'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                    )}
                  >
                    <event.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.content}{' '}
                      <a href={event.href} className="font-medium text-gray-900">
                        {event.target}
                      </a>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={event.datetime}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
