import type { ReactNode } from 'react'

interface AppProvidersProps {
  children: ReactNode
}

/** App-wide providers — add Theme, QueryClient, Firebase, etc. here later. */
export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
  return <>{children}</>
}
