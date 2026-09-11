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

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, enabled: 'dashboard' },
      { label: 'Rooms', to: '/pg/rooms', icon: BedDouble, enabled: 'rooms' },
      { label: 'Bookings', to: '/pg/bookings', icon: CalendarCheck, enabled: 'bookings' },
      { label: 'Customers', to: '/pg/customers', icon: UsersRound, enabled: 'customers' }
    ]
  },
  {
    title: 'Finance & Operations',
    items: [
      { label: 'Billing', to: '/pg/billing', icon: Wallet, enabled: 'billing' },
      { label: 'Expenses', to: '/pg/expenses', icon: Receipt, enabled: 'expenses' },
      { label: 'Meals', to: '/pg/meals', icon: Utensils, enabled: 'meals' }
    ]
  },
  {
    title: 'Administration',
    items: [
      { label: 'Branches', to: '/pg/branches', icon: Building2, enabled: 'branches' },
      { label: 'Staff', to: '/pg/staff', icon: UserRound, enabled: 'staff' },
      { label: 'Reports', to: '/pg/reports', icon: BarChart3, enabled: 'reports' },
      { label: 'Settings', to: '/pg/settings', icon: Settings, enabled: 'settings' }
    ]
  }
]

interface DashboardSidebarProps {
  open: boolean
  onClose: () => void
}

function getInitials(name?: string | null): string {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface SidebarContentProps {
  groups: NavGroup[]
  onClose: () => void
  user: {
    displayName?: string | null
    email?: string | null
    role?: string
  }
  isMobile: boolean
}

function SidebarContent({ groups, onClose, user, isMobile }: SidebarContentProps): React.JSX.Element {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 pt-[env(safe-area-inset-top)] sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-[family-name:var(--font-display)] text-base font-bold text-sidebar-foreground">
              PG Management
            </h1>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-sidebar-muted">
              Property Suite
            </p>
          </div>
        </div>

        {isMobile && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-muted hover:bg-white/10 hover:text-sidebar-foreground lg:hidden"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 sidebar-scrollbar">
        {groups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-sidebar-muted/70">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-200 font-semibold ring-1 ring-emerald-400/30'
                          : 'text-sidebar-muted hover:bg-white/8 hover:text-sidebar-foreground'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors duration-150',
                            isActive
                              ? 'text-emerald-300'
                              : 'text-sidebar-muted group-hover:text-sidebar-foreground'
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 ring-1 ring-white/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/25 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
            {getInitials(user.displayName || user.email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              {user.displayName || user.email || 'User'}
            </p>
            <p className="truncate text-[10px] font-medium capitalize text-sidebar-muted">
              {user.role ? user.role.replace(/_/g, ' ') : 'Staff'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps): React.JSX.Element {
  const { user } = useAuth()

  if (!user) {
    return <></>
  }

  const permissions = rolePermission[user.role] ?? []

  const visibleGroups = navGroups
    .map((group) => ({
      title: group.title,
      items: group.items.filter((item) => permissions.includes(item.enabled))
    }))
    .filter((group) => group.items.length > 0)

  return (
    <>
      {/* Mobile Drawer (Hidden on lg+) */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Dark Backdrop */}
        <button
          type="button"
          aria-label="Close navigation"
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Off-canvas Slide Panel */}
        <aside
          className={cn(
            'relative flex h-full w-64 max-w-[85vw] flex-col bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-300 ease-in-out',
            open ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <SidebarContent
            groups={visibleGroups}
            onClose={onClose}
            user={user}
            isMobile
          />
        </aside>
      </div>

      {/* Desktop Sticky Fixed Sidebar (Hidden on mobile, sticky on lg+) */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-white/10 lg:bg-sidebar lg:text-sidebar-foreground">
        <SidebarContent
          groups={visibleGroups}
          onClose={onClose}
          user={user}
          isMobile={false}
        />
      </aside>
    </>
  )
}
