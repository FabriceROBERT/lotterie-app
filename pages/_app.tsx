import '@/styles/globals.css'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
  return( <ThirdwebProvider activeChain={'mumbai'}> 
  <Component {...pageProps} />
  <Toaster/></ThirdwebProvider>)
}
