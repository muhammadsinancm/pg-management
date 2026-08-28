import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BedDouble,
  Wallet,
  CalendarCheck,
  BarChart3,
  type LucideIcon
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  enabled: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Rooms', to: '/pg/rooms', icon: BedDouble, enabled: true },
  { label: 'Payments', to: '/pg/payments/create', icon: Wallet, enabled: true },
  { label: 'Bookings', to: '/pg/bookings', icon: CalendarCheck, enabled: true },
  { label: 'Reports', to: '/pg/reports', icon: BarChart3, enabled: true }
]

export function DashboardSidebar(): React.JSX.Element {
  return (
    <aside className="flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sidebar-muted">
          Bisidq
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-xl text-sidebar-foreground">
          PG Management
        </h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          if (!item.enabled) {
            return (
              <span
                key={item.to}
                className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-muted/70"
                title="Coming soon"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            )
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-white/12 text-white'
                    : 'text-sidebar-muted hover:bg-white/8 hover:text-sidebar-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4 text-xs text-sidebar-muted">
        On-premise · single user · modules unlock next.
      </div>
    </aside>
  )
}
