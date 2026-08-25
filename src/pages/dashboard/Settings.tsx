import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Camera,
  Eye,
  EyeOff,
  FileText,
  Info,
  Lock,
  Shield,
  User,
  type LucideIcon,
} from 'lucide-react'
import { message } from 'antd'
import RichTextEditor from '../../components/dashboard/settings/RichTextEditor'
import { imageUrl } from '../../components/share/getImageUrl'
import {
  useChangePassword,
  useGetProfile,
  useUpdateProfile,
} from '../../hooks/useProfile'

type TabKey = 'profile' | 'password' | 'about' | 'privacy' | 'terms'

type Tab = {
  key: TabKey
  label: string
  icon: LucideIcon
}

const tabs: Tab[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'password', label: 'Change Password', icon: Lock },
  { key: 'about', label: 'About Us', icon: Info },
  { key: 'privacy', label: 'Privacy Policy', icon: Shield },
  { key: 'terms', label: 'Terms of Service', icon: FileText },
]

const initialAbout =
  '<h2>About Focus Key</h2><p>Focus Key helps teams build healthier digital habits through gentle accountability and shared focus sessions.</p>'

const initialPrivacy =
  '<h2>Privacy Policy</h2><p>We respect your privacy. This policy explains what data we collect, how we use it, and the choices you have.</p>'

const initialTerms =
  '<h2>Terms of Service</h2><p>By using Focus Key, you agree to the terms outlined below. Please read them carefully before using the service.</p>'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile')
  const [aboutHtml, setAboutHtml] = useState(initialAbout)
  const [privacyHtml, setPrivacyHtml] = useState(initialPrivacy)
  const [termsHtml, setTermsHtml] = useState(initialTerms)

  return (
    <div className="-mx-8 -mb-10 min-h-full bg-[#f6f7fb] px-8 py-8 text-slate-900">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your profile and platform configuration
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:w-64">
          <nav className="flex flex-col gap-1">
            {tabs.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand/15 text-brand'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'password' && <PasswordTab />}
          {activeTab === 'about' && (
            <EditorTab
              title="About Us"
              description="Update the About Us content shown to your users."
              value={aboutHtml}
              onChange={setAboutHtml}
            />
          )}
          {activeTab === 'privacy' && (
            <EditorTab
              title="Privacy Policy"
              description="Update the Privacy Policy content shown to your users."
              value={privacyHtml}
              onChange={setPrivacyHtml}
            />
          )}
          {activeTab === 'terms' && (
            <EditorTab
              title="Terms of Service"
              description="Update the Terms of Service content shown to your users."
              value={termsHtml}
              onChange={setTermsHtml}
            />
          )}
        </section>
      </div>
    </div>
  )
}

function ProfileTab() {
  const { data: profileUser, isLoading } = useGetProfile()
  const updateProfile = useUpdateProfile()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    if (profileUser) {
      setName(profileUser.name || '')
      setEmail(profileUser.email || '')
      if (profileUser.profileImage) {
        setAvatarPreview(profileUser.profileImage)
      }
    }
  }, [profileUser])

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(String(reader.result ?? ''))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateProfile.mutate({
      data: { name, email },
      file: avatarFile,
    })
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Loading profile...
      </div>
    )
  }

  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="border-b border-slate-100 px-8 pt-7 pb-5">
        <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your personal details and profile picture
        </p>
      </div>

      <div className="px-8 py-7">
        <div className="flex items-center gap-5">
          <label className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full bg-gradient-to-br from-brand to-brand-hover ring-4 ring-brand/20">
            {avatarPreview ? (
              <img
                src={imageUrl(avatarPreview)}
                alt={name || 'Profile'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                {initials}
              </span>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white shadow ring-2 ring-white">
              <Camera size={14} />
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>

          <div>
            <div className="text-base font-bold text-slate-900">{name || 'Admin User'}</div>
            <div className="text-sm text-slate-500">{profileUser?.role || 'SUPER_ADMIN'}</div>
            <div className="mt-1 text-xs text-slate-400">
              Click the camera icon to upload a new photo
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Field
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-slate-700">Role</label>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm text-slate-700">
            <span className="font-medium">{profileUser?.role || 'SUPER_ADMIN'}</span>
            <span className="text-slate-400">(Read-only)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-slate-100 px-8 py-5">
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

function PasswordTab() {
  const changePassword = useChangePassword()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      message.error('Please fill in all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      message.error('New password and confirm password do not match')
      return
    }

    changePassword.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="border-b border-slate-100 px-8 pt-7 pb-5">
        <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
        <p className="mt-1 text-sm text-slate-500">
          Use a strong password to keep your account secure
        </p>
      </div>

      <div className="space-y-5 px-8 py-7">
        <PasswordField
          label="Current Password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          visible={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
        />
        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          visible={showNext}
          onToggle={() => setShowNext((v) => !v)}
        />
        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          visible={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
        />
      </div>

      <div className="flex items-center justify-end border-t border-slate-100 px-8 py-5">
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {changePassword.isPending ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  )
}

type EditorTabProps = {
  title: string
  description: string
  value: string
  onChange: (value: string) => void
}

function EditorTab({ title, description, value, onChange }: EditorTabProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="border-b border-slate-100 px-8 pt-7 pb-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="px-8 py-7">
        <RichTextEditor value={value} onChange={onChange} />
      </div>

      <div className="flex items-center justify-end border-t border-slate-100 px-8 py-5">
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  type?: string
}

function Field({ label, value, onChange, type = 'text' }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-full bg-slate-100 px-5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-ring"
      />
    </label>
  )
}

type PasswordFieldProps = {
  label: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  visible: boolean
  onToggle: () => void
}

function PasswordField({ label, value, onChange, visible, onToggle }: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700">{label}</span>
      <div className="relative mt-2">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="w-full rounded-full bg-slate-100 px-5 py-3 pr-12 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-ring"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  )
}
