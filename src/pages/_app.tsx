import 'styles/main.css'
import 'react-toastify/dist/ReactToastify.css'

import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import * as ThemeContext from 'contexts/ThemeContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeContext.ThemeProvider>
        <Component {...pageProps} />
        <ToastContainer closeOnClick={false} />
      </ThemeContext.ThemeProvider>
    </>
  )
}
