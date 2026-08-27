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
import { Avatar } from '../../components/share/Avatar'
import {
  useChangePassword,
  useGetProfile,
  useUpdateProfile,
} from '../../hooks/useProfile'
import { useGetRule, useSaveRule } from '../../hooks/useRules'
import type { RuleType } from '../../types/rules'

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

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile')

  return (
    <div className="py-2 text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage your profile and platform configuration
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 rounded-2xl border border-surface-border bg-surface-card p-3 shadow-sm lg:w-64">
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
                      ? 'bg-gradient-to-r from-brand to-brand-hover text-white shadow'
                      : 'text-gray-300 hover:bg-surface-elevated hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="flex-1 rounded-2xl border border-surface-border bg-surface-card shadow-sm">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'password' && <PasswordTab />}
          {activeTab === 'about' && (
            <EditorTab
              type="ABOUT"
              title="About Us"
              description="Update the About Us content shown to your users."
            />
          )}
          {activeTab === 'privacy' && (
            <EditorTab
              type="PRIVACY"
              title="Privacy Policy"
              description="Update the Privacy Policy content shown to your users."
            />
          )}
          {activeTab === 'terms' && (
            <EditorTab
              type="TERMS"
              title="Terms of Service"
              description="Update the Terms of Service content shown to your users."
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
      <div className="p-8 text-center text-sm text-gray-400">
        Loading profile...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="border-b border-surface-border px-8 pt-7 pb-5">
        <h2 className="text-lg font-bold text-white">Profile Information</h2>
        <p className="mt-1 text-sm text-gray-400">
          Update your personal details and profile picture
        </p>
      </div>

      <div className="px-8 py-7">
        <div className="flex items-center gap-5">
          <label className="group relative cursor-pointer shrink-0">
            <Avatar
              src={avatarPreview}
              name={name || 'Admin User'}
              className="h-20 w-20 bg-gradient-to-br from-brand to-brand-hover ring-4 ring-brand/20 text-xl font-semibold text-white"
              iconClassName="h-10 w-10 text-white"
            />
            <span className="absolute -bottom-1 -right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white shadow ring-2 ring-surface-card">
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
            <div className="text-base font-bold text-white">{name || 'Admin User'}</div>
            <div className="text-sm text-gray-400">{profileUser?.role || 'SUPER_ADMIN'}</div>
            <div className="mt-1 text-xs text-gray-400">
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
          <label className="block text-sm font-semibold text-gray-300">Role</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-surface-border bg-surface-elevated/50 px-5 py-3 text-sm text-gray-300">
            <span className="font-medium text-white">{profileUser?.role || 'SUPER_ADMIN'}</span>
            <span className="text-gray-400">(Read-only)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-surface-border px-8 py-5">
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="rounded-xl bg-gradient-to-r from-brand to-brand-hover px-6 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:opacity-90 disabled:opacity-50"
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
      <div className="border-b border-surface-border px-8 pt-7 pb-5">
        <h2 className="text-lg font-bold text-white">Change Password</h2>
        <p className="mt-1 text-sm text-gray-400">
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

      <div className="flex items-center justify-end border-t border-surface-border px-8 py-5">
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="rounded-xl bg-gradient-to-r from-brand to-brand-hover px-6 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {changePassword.isPending ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  )
}

type EditorTabProps = {
  type: RuleType
  title: string
  description: string
}

function EditorTab({ type, title, description }: EditorTabProps) {
  const { data: ruleData, isLoading } = useGetRule(type)
  const saveRule = useSaveRule()
  const [content, setContent] = useState('')

  useEffect(() => {
    if (ruleData?.content !== undefined) {
      setContent(ruleData.content)
    }
  }, [ruleData])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveRule.mutate({ type, content })
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        Loading {title}...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="border-b border-surface-border px-8 pt-7 pb-5">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>

      <div className="px-8 py-7">
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="flex items-center justify-end border-t border-surface-border px-8 py-5">
        <button
          type="submit"
          disabled={saveRule.isPending}
          className="rounded-xl bg-gradient-to-r from-brand to-brand-hover px-6 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {saveRule.isPending ? 'Saving...' : 'Save Changes'}
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
      <span className="block text-sm font-semibold text-gray-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-surface-border bg-surface-elevated px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
      <span className="block text-sm font-semibold text-gray-300">{label}</span>
      <div className="relative mt-2">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-surface-border bg-surface-elevated px-5 py-3 pr-12 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  )
}
