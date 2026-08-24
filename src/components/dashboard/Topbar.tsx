import { useLocation } from 'react-router-dom'
import PresentKeyLogo from '../auth/Logo'

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Business',
    subtitle: 'Core product and usage health at a glance.',
  },
  '/dashboard/users': {
    title: 'Users',
    subtitle: 'All users and setup health.',
  },
  '/dashboard/social': {
    title: 'Social',
    subtitle: 'Core partner and joint-session activity.',
  },
  '/dashboard/devices': {
    title: 'Devices',
    subtitle: 'Manage registered devices and bulk import via CSV.',
  },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] ?? PAGE_META['/dashboard']

  return (
    <header className="flex items-start justify-between gap-4 px-8 pt-8 pb-4">
      <div>
        <h1 className="text-3xl font-semibold text-white">{meta.title}</h1>
        <p className="mt-1 text-sm text-gray-400">{meta.subtitle}</p>
      </div>
      <div className="shrink-0">
        <PresentKeyLogo size={34} />
      </div>
    </header>
  )
}
