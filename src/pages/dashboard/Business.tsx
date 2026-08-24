import {
  Activity,
  Clock,
  Coffee,
  Lock,
  Unlock,
  ShieldCheck,
  Users as UsersIcon,
  UserCheck,
  UsersRound,
} from 'lucide-react'
import DeltaStatCard from '../../components/dashboard/DeltaStatCard'
import FocusTimeChart from '../../components/dashboard/FocusTimeChart'
import { useAnalyticsStats, useFocusTimeOverTime } from '../../hooks/useAnalytics'

export default function Business() {
  const { data: stats, isLoading: isStatsLoading } = useAnalyticsStats()
  const { data: focusTimeData, isLoading: isChartLoading } = useFocusTimeOverTime()

  const formatter = new Intl.NumberFormat('en-US')

  const headlineStats = [
    {
      label: 'Total Users',
      value: isStatsLoading ? '...' : formatter.format(stats?.totalUsers ?? 0),
      delta: 'Live',
      icon: UsersIcon,
    },
    {
      label: 'Activated Users',
      value: isStatsLoading ? '...' : formatter.format(stats?.activatedUsers ?? 0),
      delta: 'Live',
      icon: UserCheck,
    },
    {
      label: '7-Day Active Users',
      value: isStatsLoading ? '...' : formatter.format(stats?.sevenDayActiveUsers ?? 0),
      delta: 'Live',
      icon: Activity,
    },
    {
      label: 'Focus Sessions\nThis Week',
      value: isStatsLoading ? '...' : formatter.format(stats?.totalFocusSessionsThisWeek ?? 0),
      delta: 'Live',
      icon: Clock,
    },
  ]

  const keyStats = [
    {
      label: 'Breaks Taken',
      value: isStatsLoading ? '...' : formatter.format(stats?.totalBreaksTaken ?? 0),
      icon: Coffee,
    },
    {
      label: 'Total Locks',
      value: isStatsLoading ? '...' : formatter.format(stats?.totalLocks ?? 0),
      icon: Lock,
    },
    {
      label: 'Total Unlocks',
      value: isStatsLoading ? '...' : formatter.format(stats?.totalUnlocks ?? 0),
      icon: Unlock,
    },
    {
      label: 'Cooldown Completed',
      value: isStatsLoading ? '...' : formatter.format(stats?.cooldownCompleted ?? 0),
      icon: ShieldCheck,
    },
    {
      label: 'Users With Partners',
      value: isStatsLoading ? '...' : formatter.format(stats?.usersWithPartners ?? 0),
      icon: UsersIcon,
    },
    {
      label: 'Joint Sessions',
      value: isStatsLoading ? '...' : formatter.format(stats?.jointSessions ?? 0),
      icon: UsersRound,
    },
  ]

  const chartData = (focusTimeData?.focusTimeOverTime || []).map((item) => ({
    date: item.date,
    hours: item.focusMinutes,
  }))

  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {headlineStats.map((stat) => (
          <DeltaStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
            icon={stat.icon}
          />
        ))}
      </section>

      <section className="w-full">
        <FocusTimeChart
          title="Focus Time Over Time"
          data={chartData}
          seriesLabel="Focus Time (Minutes)"
          isLoading={isChartLoading}
        />
      </section>

      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <h3 className="text-base font-semibold text-white">Key Stats This Week</h3>
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 xl:grid-cols-6">
          {keyStats.map((s) => (
            <div key={s.label}>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/15 text-brand">
                  <s.icon size={14} />
                </span>
                {s.label}
              </div>
              <div className="mt-3 flex items-baseline gap-1 text-2xl font-semibold text-white">
                <span>{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
