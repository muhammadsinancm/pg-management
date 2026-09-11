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
  Settings,
  X
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { rolePermission } from '@/features/auth/permissions/rolePermissions'
import { Button } from '@/shared/components/ui/button'

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

interface DashboardSidebarProps {
  open: boolean
  onClose: () => void
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps): React.JSX.Element {
  const { user } = useAuth()

  if (!user) {
    return <></>
  }

  const pesmissions = rolePermission[user.role]

  const visibleNavItems = navItems.filter((item) => pesmissions.includes(item.enabled))

  return (
    <div
      className={cn(
        'z-50',
        open ? 'max-lg:fixed max-lg:inset-0' : 'max-lg:hidden',
        'lg:relative lg:z-auto lg:block lg:h-full lg:w-60 lg:shrink-0'
      )}
    >
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="absolute inset-0 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside className="relative flex h-full w-60 max-w-[85vw] flex-col bg-sidebar pt-[env(safe-area-inset-top)] text-sidebar-foreground max-lg:h-full">
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sidebar-muted">
              Bisidq
            </p>

            <h1 className="mt-1 font-[family-name:var(--font-display)] text-xl text-sidebar-foreground">
              PG Management
            </h1>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-white/10 lg:hidden"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {visibleNavItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-white/12 text-white'
                      : 'text-sidebar-muted hover:bg-white/8 hover:text-sidebar-foreground'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-xs text-sidebar-muted">
          On-premise · single user · modules unlock next.
        </div>
      </aside>
    </div>
  )
}
