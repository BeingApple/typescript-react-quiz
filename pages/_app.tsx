import "@/styles/globals.css";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from 'react-redux'
import { useEffect, useState } from "react";
import { setupStore } from '@/store/store'
import Head from "next/head";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Layout from "@/components/layout/Layout";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter"
import theme from "@/themes/theme"
import useLocalStorage from "@/hooks/useLocalStorage";
import { Note } from "@/types/quiz-types";

export default function App(props: AppProps) {
  const { Component, pageProps: { dehydratedState, ...restPageProps } } = props

  const [queryClient] = useState(() => new QueryClient())
  const [store, setStore] = useState(() => setupStore())
  const { state } = useLocalStorage<Array<Note>>({key: "note"})

  useEffect(() => {
    setStore(() => setupStore({
      note: {
        noteList: state
      }
    }))
  }, [state])

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Layout>
                <Component {...restPageProps} />
              </Layout>
            </ThemeProvider >
          </HydrationBoundary>
        </QueryClientProvider>
      </ReduxProvider>
    </AppCacheProvider>
  );
}
