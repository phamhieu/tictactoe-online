import * as React from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import Loading from '../components/Loading'

const Auth: React.FC = () => {
  return (
    <>
      <div className="flex-shrink-0 flex justify-center">
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Tic Tac Toe online
        </h1>
      </div>
      <div className="mx-auto py-24">
        <div className="text-center">
          <p className="mt-2 text-base text-gray-500">
            Sign in with magic link to start playing with others
          </p>
          <MagicLinkForm />
        </div>
      </div>
    </>
  )
}

export default Auth

const MagicLinkForm: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')

  const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      toast.success('Check your email for the login link!')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action="#" className="mt-6 flex flex-col">
      <div className="w-full">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          type="text"
          name="email"
          id="email"
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter an email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={handleLogin}
      >
        {loading && <Loading />}
        Send magic link
      </button>
    </form>
  )
}
