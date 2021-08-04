import { AuthSession, User } from '@supabase/supabase-js'
import * as React from 'react'
import { supabase } from '../lib/supabaseClient'

const ProfileHeading: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    setUser(supabase.auth.user())

    supabase.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
      setUser(session?.user ?? null)
    })
  }, [])

  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex items-start space-x-5">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              className="h-16 w-16 rounded-full"
              src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt=""
            />
            <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
          </div>
        </div>
        <div className="pt-1.5">
          <h1 className="text-2xl font-bold text-gray-900">{user?.email}</h1>
          <p className="text-sm font-medium text-gray-500">Win: 3 | Lose: 2</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfileHeading
