import * as React from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { StoreContext } from '../lib/store'
import { observer } from 'mobx-react-lite'
import Loading from '../components/Loading'

const ProfileHeading: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)

  React.useEffect(() => {
    _store.updatePresenceAsync()
    const intervalId = setInterval(() => {
      _store.updatePresenceAsync()
    }, 9000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <Profile />
      <LogoutButton />
    </div>
  )
})

export default ProfileHeading

const Profile: React.FC = observer(() => {
  const _store = React.useContext(StoreContext)
  return (
    <div className="flex items-start space-x-5">
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            className="h-16 w-16 rounded-full"
            src="https://via.placeholder.com/200?text=avatar"
            alt="profile avatar"
          />
          <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
        </div>
      </div>
      <div className="pt-1.5">
        <h1 className="text-2xl font-bold text-gray-900">{_store.user?.email}</h1>
        <p className="text-sm font-medium text-gray-500">Win: 3 | Lose: 2</p>
      </div>
    </div>
  )
})

const LogoutButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false)

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
      <button
        type="button"
        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        onClick={handleLogout}
      >
        {loading && <Loading />}
        Logout
      </button>
    </div>
  )
}
