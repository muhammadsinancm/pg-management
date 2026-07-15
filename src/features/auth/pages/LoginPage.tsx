import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { LoginForm } from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function LoginPage(): React.JSX.Element {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#d8efe8_0%,_transparent_45%),radial-gradient(ellipse_at_bottom_right,_#e7e2d8_0%,_transparent_40%),linear-gradient(160deg,_#f7f4ee_0%,_#ebe6dc_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(15,107,92,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,107,92,0.06)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <Card className="relative z-10 w-full max-w-md border-border/80 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            PG Management
          </p>
          <CardTitle className="font-[family-name:var(--font-display)] text-3xl">
            Welcome back
          </CardTitle>
          <CardDescription>Sign in with your account to open the on-premise dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
