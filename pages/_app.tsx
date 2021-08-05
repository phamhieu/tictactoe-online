import '../styles/globals.css'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Store, { StoreContext } from '../lib/store'
import { supabase } from '../lib/supabaseClient'
import { AuthSession } from '@supabase/supabase-js'

const PortalRootWithNoSSR = dynamic(
  (() => import('@radix-ui/react-portal').then((portal) => portal.Root)) as any,
  { ssr: false }
)

function MyApp({ Component, pageProps }: AppProps) {
  const store = new Store()

  useEffect(() => {
    store.setSession(supabase.auth.session())

    const subscription = supabase.auth.onAuthStateChange(
      (_event: string, session: AuthSession | null) => {
        store.setSession(session)
      }
    )

    return () => {
      subscription?.data?.unsubscribe()
    }
  }, [])

  return (
    <StoreContext.Provider value={store}>
      <Component {...pageProps} />
      <PortalToast />
    </StoreContext.Provider>
  )
}
export default MyApp

const PortalToast = () => (
  <PortalRootWithNoSSR>
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'font-medium',
        style: {
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          fontSize: '0.875rem',
        },
      }}
    />
  </PortalRootWithNoSSR>
)
