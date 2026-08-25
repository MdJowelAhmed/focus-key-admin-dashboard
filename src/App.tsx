import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import CheckEmail from './pages/auth/CheckEmail'
import SetNewPassword from './pages/auth/SetNewPassword'
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess'
import DashboardLayout from './layouts/DashboardLayout'
import Business from './pages/dashboard/Business'
import Users from './pages/dashboard/Users'
import Social from './pages/dashboard/Social'
import Devices from './pages/dashboard/Devices'
import Faqs from './pages/dashboard/Faqs'
import Settings from './pages/dashboard/Settings'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/reset-password" element={<SetNewPassword />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccess />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Business />} />
          <Route path="users" element={<Users />} />
          <Route path="social" element={<Social />} />
          <Route path="devices" element={<Devices />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
