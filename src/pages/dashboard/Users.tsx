import { useMemo, useState } from 'react'
import {
  ChevronDown,
  Clock,
  Filter,
  Nfc,
  Search,
  UserCheck,
  Users as UsersIcon,
} from 'lucide-react'
import DeltaStatCard from '../../components/dashboard/DeltaStatCard'
import {
  SETUP_STAGES,
  DIRECTORY_STATUSES,
  directoryUsers,
  type DirectoryStatus,
  type DirectoryUser,
  type SetupStage,
} from '../../components/dashboard/usersDirectoryData'

const headlineStats = [
  { label: 'Total Users', value: '12,482', delta: '8.6%', icon: UsersIcon },
  { label: 'Activated Users', value: '8,932', delta: '12.3%', icon: UserCheck },
  { label: 'Pending Setup', value: '1,987', delta: '7.1%', icon: Clock },
  { label: 'NFC Linked', value: '9,876', delta: '10.7%', icon: Nfc },
]

const SETUP_STAGE_OPTIONS = ['All Setup Stages', ...SETUP_STAGES] as const
const STATUS_OPTIONS = ['All Statuses', ...DIRECTORY_STATUSES] as const

type SetupStageFilter = (typeof SETUP_STAGE_OPTIONS)[number]
type StatusFilter = (typeof STATUS_OPTIONS)[number]

export default function Users() {
  const [search, setSearch] = useState('')
  const [setupStage, setSetupStage] = useState<SetupStageFilter>('All Setup Stages')
  const [status, setStatus] = useState<StatusFilter>('All Statuses')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return directoryUsers.filter((u) => {
      if (setupStage !== 'All Setup Stages' && u.setupStage !== setupStage) return false
      if (status !== 'All Statuses' && u.status !== status) return false
      if (!term) return true
      return u.email.toLowerCase().includes(term)
    })
  }, [search, setupStage, status])

  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {headlineStats.map((s) => (
          <DeltaStatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            icon={s.icon}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="h-10 w-full rounded-full border border-surface-border bg-surface-elevated/70 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Dropdown
              value={setupStage}
              options={SETUP_STAGE_OPTIONS as readonly string[]}
              onChange={(v) => setSetupStage(v as SetupStageFilter)}
              width={170}
            />
            <Dropdown
              value={status}
              options={STATUS_OPTIONS as readonly string[]}
              onChange={(v) => setStatus(v as StatusFilter)}
              width={150}
            />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-surface-border bg-surface-elevated text-gray-300 transition-colors hover:text-white"
              aria-label="Advanced filters"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="border-b border-surface-border pb-3 pl-1 font-medium">User</th>
                <th className="border-b border-surface-border pb-3 font-medium">Registered</th>
                <th className="border-b border-surface-border pb-3 font-medium">Setup Stage</th>
                <th className="border-b border-surface-border pb-3 font-medium">NFC Status</th>
                <th className="border-b border-surface-border pb-3 font-medium">Last Active</th>
                <th className="border-b border-surface-border pb-3 font-medium">Total Sessions</th>
                <th className="border-b border-surface-border pb-3 pr-1 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((user) => (
                <UserRow key={user.key} user={user} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function UserRow({ user }: { user: DirectoryUser }) {
  return (
    <tr className="text-gray-200">
      <td className="py-3 pl-1">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/30 text-xs font-semibold text-brand-ring">
            {user.initials}
          </span>
          <span className="text-gray-200">{user.email}</span>
        </div>
      </td>
      <td className="py-3 text-gray-300">{user.registered}</td>
      <td className="py-3">
        <SetupStageBadge stage={user.setupStage} />
      </td>
      <td className="py-3">
        <NfcStatusBadge nfc={user.nfcStatus} />
      </td>
      <td className="py-3 text-gray-300">{user.lastActive}</td>
      <td className="py-3 text-gray-300">{user.totalSessions}</td>
      <td className="py-3 pr-1">
        <StatusPill status={user.status} />
      </td>
    </tr>
  )
}

function SetupStageBadge({ stage }: { stage: SetupStage }) {
  const dotColor =
    stage === 'Setup Completed'
      ? 'bg-accent-success'
      : stage === 'Invite Sent'
      ? 'bg-gray-400'
      : 'bg-brand'
  return (
    <span className="inline-flex items-center gap-2 text-gray-200">
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      {stage}
    </span>
  )
}

function NfcStatusBadge({ nfc }: { nfc: 'Linked' | 'Not Linked' }) {
  const dot = nfc === 'Linked' ? 'bg-accent-success' : 'bg-accent-danger'
  return (
    <span className="inline-flex items-center gap-2 text-gray-200">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {nfc}
    </span>
  )
}

function StatusPill({ status }: { status: DirectoryStatus }) {
  const map: Record<DirectoryStatus, string> = {
    Active: 'bg-accent-pitchSoft/40 text-accent-success border border-accent-success/30',
    Pending: 'bg-brand/15 text-brand border border-brand/30',
    Inactive: 'bg-surface-elevated text-gray-400 border border-surface-border',
  }
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  )
}

type DropdownProps = {
  value: string
  options: readonly string[]
  onChange: (v: string) => void
  width?: number
}

function Dropdown({ value, options, onChange, width }: DropdownProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ width }}
        className="flex h-10 items-center justify-between gap-2 rounded-md border border-surface-border bg-surface-elevated px-3 text-sm text-gray-200 transition-colors hover:text-white"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <ul className="absolute right-0 z-10 mt-1 w-full min-w-[160px] overflow-hidden rounded-md border border-surface-border bg-surface-elevated shadow-lg">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`block w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-card ${
                  opt === value ? 'text-brand' : 'text-gray-200'
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
