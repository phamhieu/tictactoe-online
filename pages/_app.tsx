import '../styles/globals.css'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'

const PortalRootWithNoSSR = dynamic(
  (() => import('@radix-ui/react-portal').then((portal) => portal.Root)) as any,
  { ssr: false }
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <PortalToast />
    </>
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
