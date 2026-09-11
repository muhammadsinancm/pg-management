import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'

export function DashboardShell(): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!sidebarOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [sidebarOpen])

  return (
    <div className="relative flex min-h-0 w-full flex-1 overflow-hidden">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
