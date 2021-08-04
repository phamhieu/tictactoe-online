import * as React from 'react'
import { observer } from 'mobx-react-lite'
import Auth from '../components/Auth'
import Layout from '../components/Layout'
import ProfileHeading from '../components/ProfileHeading'
import { StoreContext } from '../lib/store'

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

const people = [
  {
    name: 'Leonard Krasner',
    handle: 'leonardkrasner',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Floyd Miles',
    handle: 'floydmiles',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Emily Selman',
    handle: 'emilyselman',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Kristin Watson',
    handle: 'kristinwatson',
    imageUrl:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'BBBBBBBB',
    handle: 'bbbbbbb',
    imageUrl:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]
const OnlinePlayers: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div>
        <div className="pb-5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
            <svg
              className="-ml-0.5 mr-1.5 h-2 w-2 text-green-500"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx={4} cy={4} r={3} />
            </svg>
            2 Online
          </span>
        </div>
      </div>
      <div className="max-h-80 overflow-y-scroll">
        <div className="flow-root mt-6">
          <ul className="-my-5 divide-y divide-gray-200">
            {people.map((person) => (
              <li key={person.handle} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://via.placeholder.com/100"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                    <p className="text-sm text-gray-500 truncate">online/offline</p>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Invite
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
