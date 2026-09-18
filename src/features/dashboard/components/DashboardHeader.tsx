import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface DashboardHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function DashboardHeader({ sidebarOpen, onToggleSidebar }: DashboardHeaderProps): React.JSX.Element {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout(): Promise<void> {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-12 sm:min-h-13 shrink-0 items-center justify-between gap-2.5 border-b border-neutral-200/70 bg-white/95 px-3 sm:px-4 lg:px-5 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8.5 w-8.5 shrink-0 rounded-lg border-neutral-200/90 bg-white text-neutral-700 shadow-2xs hover:bg-neutral-100 hover:text-neutral-900 transition-all cursor-pointer"
          aria-label={sidebarOpen ? 'Hide navigation sidebar' : 'Show navigation sidebar'}
          title={sidebarOpen ? 'Hide navigation sidebar' : 'Show navigation sidebar'}
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4.5 w-4.5" />
          ) : (
            <PanelLeftOpen className="h-4.5 w-4.5 text-neutral-900" />
          )}
        </Button>
        <div className="min-w-0">
          <p className="truncate text-xs sm:text-sm font-bold tracking-tight text-neutral-900">
            PG Management
          </p>
          <p className="hidden truncate text-[11px] font-normal text-neutral-400 sm:block">
            Overview & Operations
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="hidden min-w-0 text-right sm:block">
          <p className="truncate text-xs font-semibold leading-none text-neutral-900">
            {user?.displayName || 'Administrator'}
          </p>
          <p className="mt-0.5 hidden truncate text-[10px] text-neutral-400 md:block">
            {user?.email}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-7 sm:h-8 px-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 border-neutral-200"
        >
          <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="hidden sm:inline ml-1.5">Sign out</span>
        </Button>
      </div>
    </header>
  )
}
