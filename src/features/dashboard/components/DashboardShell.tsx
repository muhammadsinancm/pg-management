import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'

export function DashboardShell(): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return true
  })

  // Only lock body overflow on mobile when drawer is open
  useEffect(() => {
    if (!sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [sidebarOpen])

  return (
    <div className="relative flex min-h-screen lg:h-screen lg:overflow-hidden w-full bg-[#f5f6f8]">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col lg:h-full lg:overflow-hidden">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-2 sm:p-3 lg:p-3.5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
