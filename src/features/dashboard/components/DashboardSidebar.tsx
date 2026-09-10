import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BedDouble,
  Wallet,
  CalendarCheck,
  BarChart3,
  type LucideIcon,
  UsersRound,
  Building2,
  UserRound,
  Receipt,
  Utensils,
  Settings
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { rolePermission } from '@/features/auth/permissions/rolePermissions'

interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  enabled: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, enabled: 'dashboard' },
  { label: 'Rooms', to: '/pg/rooms', icon: BedDouble, enabled: 'rooms' },
  { label: 'Billing', to: '/pg/billing', icon: Wallet, enabled: 'billing' },
  { label: 'Bookings', to: '/pg/bookings', icon: CalendarCheck, enabled: 'bookings' },
  { label: 'Reports', to: '/pg/reports', icon: BarChart3, enabled: 'reports' },
  { label: 'Customers', to: '/pg/customers', icon: UsersRound, enabled: 'customers' },
  { label: 'Branches', to: '/pg/branches', icon: Building2, enabled: 'branches' },
  { label: 'Staff', to: '/pg/staff', icon: UserRound, enabled: 'staff' },
  { label: 'Expenses', to: '/pg/expenses', icon: Receipt, enabled: 'expenses' },
  { label: 'Meals', to: '/pg/meals', icon: Utensils, enabled: 'meals' },
  { label: 'Settings', to: '/pg/settings', icon: Settings, enabled: 'settings' }
]

export function DashboardSidebar(): React.JSX.Element {

  const { user } = useAuth()

  if (!user) {
    return <></>
  }

  const pesmissions = rolePermission[user.role]

  const visibleNavItems = navItems.filter((item) => pesmissions.includes(item.enabled))

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
        {visibleNavItems.map((item) => {
          const Icon = item.icon

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
