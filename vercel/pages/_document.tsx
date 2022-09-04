import { EmotionCache } from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import { NextComponentType } from 'next'
import type { AppContextType, AppInitialProps, AppPropsType } from 'next/dist/shared/lib/utils'
import type { DocumentInitialProps } from 'next/document'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import createEmotionCache from 'src/createEmotionCache'
import theme from 'src/theme'

type MyDocumentInitialProps = DocumentInitialProps & { emotionStyleTags?: JSX.Element[] }

type EnhancedApp = NextComponentType<AppContextType, AppInitialProps, AppPropsType & { emotionCache?: EmotionCache }>

export default class MyDocument extends Document<MyDocumentInitialProps> {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="emotion-insertion-point" content="" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />

          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (context) => {
  const originalRenderPage = context.renderPage

  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  context.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: EnhancedApp) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(context)
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags,
  }
}
