import { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import createEmotionCache from 'src/createEmotionCache'
import theme from 'src/theme'

type MyAppProps = AppProps & { emotionCache: EmotionCache }

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = createEmotionCache(), pageProps } = props

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Get Scheduler - Easy and realiable online free cron jobs</title>
        <meta name="description" content="Easy and realiable online free cron jobs"></meta>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
export type { MyAppProps }
