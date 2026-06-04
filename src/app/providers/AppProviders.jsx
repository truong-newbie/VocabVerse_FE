import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useEffect, useMemo } from 'react'
import { useThemeStore } from '../store/themeStore'

export default function AppProviders({ children }) {
  const initializeTheme = useThemeStore((state) => state.initializeTheme)
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    [],
  )

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
