import * as React from 'react'
import { observer } from 'mobx-react-lite'
import {
  BanIcon,
  ViewGridIcon,
  EmojiHappyIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/outline'
import Auth from '../components/Auth'
import Layout from '../components/Layout'
import ProfileHeading from '../components/ProfileHeading'
import OnlinePlayers from '../components/OnlinePlayers'
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
                Game status
              </h2>
              <div className="rounded-lg bg-white overflow-hidden shadow">
                <div className="p-6">
                  <GamesList />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

const GamesList: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)
  return (
    <ul className="divide-y divide-gray-200">
      {_store.games.length == 0 && <GamesListEmpty />}
      {_store.games.map((x) => (
        <GameListItem key={x.id} id={x.id} />
      ))}
    </ul>
  )
})

const items = [
  {
    description: "The game is played on a grid that's 3 squares by 3 squares.",
    iconColor: 'bg-blue-500',
    icon: ViewGridIcon,
  },
  {
    description: 'Players take turns putting their marks (X or O) in empty squares.',
    iconColor: 'bg-purple-500',
    icon: ChevronDoubleRightIcon,
  },
  {
    description:
      'The first player to get 3 of her marks in a row (up, down, across, or diagonally) is the winner.',
    iconColor: 'bg-green-500',
    icon: EmojiHappyIcon,
  },
  {
    description:
      'When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a tie.',
    iconColor: 'bg-red-500',
    icon: BanIcon,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
const GamesListEmpty: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">No game available</h2>
        <p className="mt-1 text-sm text-gray-500">Please invite other to a 1vs1 game.</p>
      </div>
      <div className="mt-10">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          The game rules
        </h3>
        <ul role="list" className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>
              <div className="relative group py-4 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span
                    className={classNames(
                      item.iconColor,
                      'inline-flex items-center justify-center h-10 w-10 rounded-lg'
                    )}
                  >
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

type GameListItemProps = {
  id: string
}
const GameListItem: React.FC<GameListItemProps> = observer(({ id }) => {
  const _store = React.useContext(StoreContext)
  return (
    <li className="py-4">
      <div className="block border-2 border-dashed border-gray-300 rounded bg-white h-16 w-full text-gray-200"></div>
    </li>
  )
})
