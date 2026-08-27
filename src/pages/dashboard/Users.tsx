import { useSearchParams } from 'react-router-dom'
import { Activity, Nfc, Trash2, UserCheck, Users as UsersIcon } from 'lucide-react'
import { Popconfirm } from 'antd'
import DeltaStatCard from '../../components/dashboard/DeltaStatCard'
import { useAnalyticsStats } from '../../hooks/useAnalytics'
import { useDeleteUser, useUpdateUserStatus, useUsersAnalytics } from '../../hooks/useUsers'
import { Avatar, Filtering, Pagination, SearchingInput } from '../../components/share'

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'ALL'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10

  const { data: statsData, isLoading: isStatsLoading } = useAnalyticsStats()
  const { data: usersResponse, isLoading: isUsersLoading } = useUsersAnalytics({
    page,
    limit,
    searchTerm: search,
    status: statusFilter,
  })

  const updateUserStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()

  const formatter = new Intl.NumberFormat('en-US')

  const headlineStats = [
    {
      label: 'Total Users',
      value: isStatsLoading ? '...' : formatter.format(statsData?.totalUsers ?? 0),
      icon: UsersIcon,
    },
    {
      label: 'Activated Users',
      value: isStatsLoading ? '...' : formatter.format(statsData?.activatedUsers ?? 0),
      icon: UserCheck,
    },
    {
      label: '7-Day Active Users',
      value: isStatsLoading ? '...' : formatter.format(statsData?.sevenDayActiveUsers ?? 0),
      icon: Activity,
    },
    {
      label: 'Users With Partners',
      value: isStatsLoading ? '...' : formatter.format(statsData?.usersWithPartners ?? 0),
      icon: Nfc,
    },
  ]

  const usersList = usersResponse?.data || []
  const meta = usersResponse?.meta

  const handleSearchChange = (newSearch: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (newSearch.trim()) {
      newParams.set('search', newSearch.trim())
    } else {
      newParams.delete('search')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleStatusChange = (newStatus: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (newStatus && newStatus !== 'ALL') {
      newParams.set('status', newStatus)
    } else {
      newParams.delete('status')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', String(newPage))
    setSearchParams(newParams)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatFocusTime = (minutes: number) => {
    if (!minutes) return '0 mins'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} mins`
    return `${hours}h ${mins}m`
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {headlineStats.map((s) => (
          <DeltaStatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchingInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search users by name or email..."
            className="w-full max-w-md"
          />

          <Filtering
            variant="inline"
            fields={[
              {
                key: 'status',
                placeholder: 'Filter by status',
                value: statusFilter === 'ALL' ? '' : statusFilter,
                onChange: (val) => handleStatusChange(val || 'ALL'),
                options: [
                  { label: 'All Statuses', value: 'ALL' },
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ],
              },
            ]}
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400">
                <th className="border-b border-surface-border pb-3 pl-1 font-medium">User</th>
                <th className="border-b border-surface-border pb-3 font-medium">Status</th>
                <th className="border-b border-surface-border pb-3 font-medium">Pairing</th>
                <th className="border-b border-surface-border pb-3 font-medium">Sessions</th>
                <th className="border-b border-surface-border pb-3 font-medium">Locks / Unlocks</th>
                <th className="border-b border-surface-border pb-3 font-medium">Focus Time</th>
                <th className="border-b border-surface-border pb-3 font-medium">Breaks</th>
                <th className="border-b border-surface-border pb-3 font-medium">Registered</th>
                <th className="border-b border-surface-border pb-3 font-medium">Last Active</th>
                <th className="border-b border-surface-border pb-3 pr-1 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isUsersLoading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-sm text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-sm text-gray-400">
                    No users found matching criteria.
                  </td>
                </tr>
              ) : (
                usersList.map((user) => (
                  <tr key={user.userId} className="text-gray-200 hover:bg-surface-elevated/30">
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.profileImage}
                          name={user.name}
                          className="h-9 w-9 bg-brand/30 text-xs font-semibold text-brand-ring"
                        />
                        <div>
                          <div className="font-medium text-white">{user.name || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <select
                        value={user.status}
                        disabled={updateUserStatus.isPending}
                        onChange={(e) =>
                          updateUserStatus.mutate({
                            userId: user.userId,
                            status: e.target.value as 'ACTIVE' | 'INACTIVE',
                          })
                        }
                        className={`rounded-md border px-2.5 py-1 text-xs font-medium focus:outline-none ${
                          user.status === 'ACTIVE'
                            ? 'border-accent-success/40 bg-accent-pitchSoft/40 text-accent-success'
                            : 'border-surface-border bg-surface-elevated text-gray-400'
                        }`}
                      >
                        <option value="ACTIVE" className="bg-surface-card text-white">
                          Active
                        </option>
                        <option value="INACTIVE" className="bg-surface-card text-white">
                          Inactive
                        </option>
                      </select>
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isPaired
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isPaired ? 'bg-emerald-400' : 'bg-gray-400'
                          }`}
                        />
                        {user.isPaired ? 'Paired' : 'Unpaired'}
                      </span>
                    </td>

                    <td className="py-3 text-gray-300">{user.totalSessions}</td>
                    <td className="py-3 text-gray-300">
                      {user.totalLocks} / {user.totalUnlocks}
                    </td>
                    <td className="py-3 text-gray-300">{formatFocusTime(user.totalFocusTime)}</td>
                    <td className="py-3 text-gray-300">{user.breakCount}</td>
                    <td className="py-3 text-gray-300">{formatDate(user.registeredAt)}</td>
                    <td className="py-3 text-gray-300">{formatDate(user.lastActiveAt)}</td>

                    <td className="py-3 pr-1 text-right">
                      <Popconfirm
                        title="Delete User"
                        description="Are you sure you want to delete this user?"
                        onConfirm={() => deleteUser.mutate(user.userId)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <button
                          type="button"
                          disabled={deleteUser.isPending}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-red-500/15 hover:text-red-400 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            totalItems={meta.total}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  )
}
