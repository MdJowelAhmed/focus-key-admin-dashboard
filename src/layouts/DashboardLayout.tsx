import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import { useAuthStore } from '../store/useAuthStore'

const HIDE_TOPBAR_PATHS = ['/dashboard/settings']

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()

  const hideTopbar = HIDE_TOPBAR_PATHS.some((path) => pathname.startsWith(path))

  const currentUser = {
    name: user?.name || 'Super Admin',
    role: user?.role || 'SUPER_ADMIN',
    avatarUrl: user?.profileImage || undefined,
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page text-gray-100">
      <Sidebar user={currentUser} onLogout={handleLogout} />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        {!hideTopbar && <Topbar />}
        <main className="flex-1 overflow-y-auto px-8 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
