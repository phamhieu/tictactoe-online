import * as React from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import Auth from '../components/Auth'
import Layout from '../components/Layout'
import ProfileHeading from '../components/ProfileHeading'
import { AuthSession } from '@supabase/supabase-js'

export default function Home() {
  const [session, setSession] = React.useState<AuthSession | null>(null)

  React.useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
      setSession(session)
    })
  }, [])

  return <Layout>{session ? <WaitingRoom /> : <Auth />}</Layout>
}

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
                  <div
                    style={{ height: '30rem', background: 'blue' }}
                    className="border-2 border-dashed border-gray-300 rounded-lg"
                  ></div>
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
                    style={{ height: '30rem', background: 'red' }}
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
