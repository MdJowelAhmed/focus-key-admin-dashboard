import { useState } from 'react'
import {
  CheckCircle2,
  Heart,
  Send,
  Timer,
  UserPlus,
  Users as UsersIcon,
} from 'lucide-react'
import DeltaStatCard from '../../components/dashboard/DeltaStatCard'
import FocusTimeChart from '../../components/dashboard/FocusTimeChart'
import {
  useEngagementStats,
  useFocusTimeTogetherOverTime,
  useRecentActivity,
} from '../../hooks/useSocial'
import { Avatar } from '../../components/share/Avatar'

export default function Social() {
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [selectedDays, setSelectedDays] = useState<number>(7)

  const { data: engagementStats, isLoading: isStatsLoading } = useEngagementStats()
  const { data: focusTogetherData, isLoading: isChartLoading } = useFocusTimeTogetherOverTime({
    year: selectedYear,
    days: selectedDays,
  })
  const { data: recentActivityList, isLoading: isActivityLoading } = useRecentActivity()

  const formatter = new Intl.NumberFormat('en-US')

  // Calculate total focus time from the graph points
  const totalFocusMinutes = (focusTogetherData?.focusTimeTogetherOverTime || []).reduce(
    (acc, curr) => acc + (curr.focusMinutes || 0),
    0
  )

  const headlineStats = [
    {
      label: 'Users With Partners',
      value: isStatsLoading ? '...' : formatter.format(engagementStats?.usersWithPartners ?? 0),
      icon: UsersIcon,
    },
    {
      label: 'Partner Requests Accepted',
      value: isStatsLoading ? '...' : formatter.format(engagementStats?.partnerRequestsAccepted ?? 0),
      icon: UserPlus,
    },
    {
      label: 'Nudges Sent',
      value: isStatsLoading ? '...' : formatter.format(engagementStats?.nudgesSent ?? 0),
      icon: Send,
    },
    {
      label: 'Joint Sessions',
      value: isStatsLoading ? '...' : formatter.format(engagementStats?.jointSessions ?? 0),
      icon: Heart,
    },
    {
      label: 'Time Focused Together',
      value: isChartLoading ? '...' : formatter.format(totalFocusMinutes),
      valueSuffix: 'mins',
      icon: Timer,
    },
  ]

  const chartData = (focusTogetherData?.focusTimeTogetherOverTime || []).map((item) => {
    const d = new Date(item.date)
    const dateLabel = !isNaN(d.getTime())
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : item.date

    return {
      date: dateLabel,
      hours: item.focusMinutes,
    }
  })

  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {headlineStats.map((stat) => (
          <DeltaStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            valueSuffix={stat.valueSuffix}
            icon={stat.icon}
          />
        ))}
      </section>

      <section className="w-full">
        <FocusTimeChart
          title="Focus Time Together Over Time"
          data={chartData}
          seriesLabel="Focus Time Together (Minutes)"
          isLoading={isChartLoading}
          selectedDays={selectedDays}
          onDaysChange={setSelectedDays}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </section>

      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <h3 className="text-base font-semibold text-white">Recent Social Activity</h3>
        <div className="mt-4 overflow-x-auto">
          {isActivityLoading ? (
            <div className="py-8 text-center text-sm text-gray-400">Loading recent activity...</div>
          ) : !recentActivityList || recentActivityList.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">No recent activity found</div>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="pb-3 pl-1 font-medium">User</th>
                  <th className="pb-3 font-medium">Event</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 pr-1 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {recentActivityList.map((row, idx) => {
                  const Icon = getEventIcon(row.event)
                  const formattedTime = formatTime(row.time)

                  return (
                    <tr key={(row.user?.email || 'user') + row.time + idx} className="text-gray-200">
                      <td className="py-3 pl-1">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={row.user?.profileImage}
                            name={row.user?.name}
                            className="h-8 w-8 bg-brand/30 text-xs font-semibold text-brand-ring"
                          />
                          <div>
                            <div className="font-medium text-white">{row.user?.name || 'Unknown User'}</div>
                            {row.user?.email && (
                              <div className="text-xs text-gray-400">{row.user.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-2 text-gray-300">
                          <Icon size={14} className="text-brand" />
                          {row.event}
                        </span>
                      </td>
                      <td className="py-3 text-gray-300">{formattedTime}</td>
                      <td className="py-3 pr-1 text-right">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}

function getEventIcon(event: string) {
  if (!event) return CheckCircle2
  const e = event.toLowerCase()
  if (e.includes('partner')) return UserPlus
  if (e.includes('nudge')) return Send
  if (e.includes('completed')) return CheckCircle2
  if (e.includes('session') || e.includes('joint')) return Heart
  return UsersIcon
}



function formatTime(isoString: string) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function StatusBadge({ status }: { status: string }) {
  const isPositive =
    status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'active'
  const styles = isPositive
    ? 'bg-accent-pitchSoft/40 text-accent-success border border-accent-success/30'
    : 'bg-brand/15 text-brand border border-brand/30'
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  )
}
