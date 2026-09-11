import { AppProviders } from './providers'
import { AppRouter } from './router'

export function App(): React.JSX.Element {
  return (
    <AppProviders>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <AppRouter />
      </div>
    </AppProviders>
  )
}
