import { Link, NavLink } from 'react-router-dom'
import { Building2, Cpu, HelpCircle, LogOut, MessageCircle, Settings, Users, type LucideIcon } from 'lucide-react'
import PresentKeyLogo from '../auth/Logo'
import { Avatar } from '../share/Avatar'

type NavItem = {
  label: string
  to: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: 'Business', to: '/dashboard', icon: Building2 },
  { label: 'Users', to: '/dashboard/users', icon: Users },
  { label: 'Social', to: '/dashboard/social', icon: MessageCircle },
  { label: 'Devices', to: '/dashboard/devices', icon: Cpu },
  { label: 'FAQ', to: '/dashboard/faqs', icon: HelpCircle },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
]

type Props = {
  user: {
    name: string
    role: string
    avatarUrl?: string
  }
  onLogout?: () => void
}

export default function Sidebar({ user, onLogout }: Props) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-surface-border bg-surface-sidebar">
      <div className="flex items-center gap-3 px-6 py-6">
        <Link to="/dashboard" className="transition-opacity hover:opacity-90">
          <PresentKeyLogo size={34} />
        </Link>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-brand to-brand-hover text-white shadow'
                  : 'text-gray-300 hover:bg-surface-elevated hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span className="flex-1 truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            className="h-10 w-10 bg-brand/30 text-sm font-semibold text-brand-ring"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">{user.name}</div>
            <div className="truncate text-xs text-gray-400">{user.role}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-surface-elevated hover:text-white"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  )
}
