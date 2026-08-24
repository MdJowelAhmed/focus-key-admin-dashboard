import {
  Bell,
  CheckCircle2,
  Heart,
  Send,
  Timer,
  User,
  UserPlus,
  Users as UsersIcon,
} from 'lucide-react'
import DeltaStatCard from '../../components/dashboard/DeltaStatCard'
import FocusTimeChart, { type FocusTimeDatum } from '../../components/dashboard/FocusTimeChart'

const headlineStats = [
  { label: 'Users With Partners', value: '6,847', delta: '9.2%', icon: UsersIcon },
  { label: 'Partner Requests Accepted', value: '2,341', delta: '11.4%', icon: UserPlus },
  { label: 'Nudges Sent', value: '8,932', delta: '12.7%', icon: Send },
  { label: 'Joint Sessions', value: '3,218', delta: '8.6%', icon: Heart },
  {
    label: 'Time Focused Together',
    value: '812',
    valueSuffix: 'h 34m',
    delta: '12.6%',
    icon: Timer,
  },
]

const focusTogetherData: FocusTimeDatum[] = [
  { date: 'May 2', hours: 124 },
  { date: 'May 3', hours: 102 },
  { date: 'May 4', hours: 142 },
  { date: 'May 5', hours: 202 },
  { date: 'May 6', hours: 170 },
  { date: 'May 7', hours: 152 },
  { date: 'May 8', hours: 195 },
]

const socialKeyStats = [
  {
    icon: UsersIcon,
    title: 'Partner Adoption Rate',
    subtitle: '% of users with at least one partner',
    value: '64.7%',
  },
  {
    icon: User,
    title: 'Average Partners Per User',
    subtitle: '',
    value: '1.62',
  },
  {
    icon: Bell,
    title: 'Join-From-Notification Rate',
    subtitle: '% of notifications that led to a join',
    value: '38.9%',
  },
  {
    icon: CheckCircle2,
    title: 'Joint Session Completion Rate',
    subtitle: '% of joined sessions completed',
    value: '56.3%',
  },
]

type ActivityStatus = 'Completed' | 'Sent'

const recentActivity: {
  initials: string
  name: string
  event: string
  eventIcon: typeof UsersIcon
  time: string
  status: ActivityStatus
}[] = [
  {
    initials: 'JD',
    name: 'Jenna Doe',
    event: 'Partner request accepted',
    eventIcon: UserPlus,
    time: 'May 8, 2025 10:42 AM',
    status: 'Completed',
  },
  {
    initials: 'AW',
    name: 'Alex Wu',
    event: 'Nudge sent',
    eventIcon: Send,
    time: 'May 8, 2025 9:15 AM',
    status: 'Sent',
  },
  {
    initials: 'MT',
    name: 'Mike Taylor',
    event: 'Joint session joined',
    eventIcon: Heart,
    time: 'May 8, 2025 8:03 AM',
    status: 'Completed',
  },
  {
    initials: 'SC',
    name: 'Sara Chen',
    event: 'Joint session completed',
    eventIcon: CheckCircle2,
    time: 'May 7, 2025 6:47 PM',
    status: 'Completed',
  },
]

export default function Social() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {headlineStats.map((stat) => (
          <DeltaStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            valueSuffix={stat.valueSuffix}
            delta={stat.delta}
            icon={stat.icon}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <FocusTimeChart
            title="Focus Time Together Over Time"
            data={focusTogetherData}
            seriesLabel="Focus Time Together (Hours)"
          />
        </div>

        <div className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-2xl border border-surface-border bg-surface-card p-5">
            <h3 className="text-base font-semibold text-white">Key Social Stats</h3>
            <div className="mt-5 flex flex-1 flex-col gap-5">
              {socialKeyStats.map((s) => (
                <div key={s.title} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/15 text-brand">
                    <s.icon size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{s.title}</div>
                    {s.subtitle && (
                      <div className="text-xs text-gray-500">{s.subtitle}</div>
                    )}
                  </div>
                  <div className="text-xl font-semibold text-white">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <h3 className="text-base font-semibold text-white">Recent Social Activity</h3>
        <div className="mt-4 overflow-x-auto">
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
              {recentActivity.map((row) => {
                const Icon = row.eventIcon
                return (
                  <tr key={row.name + row.time} className="text-gray-200">
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/30 text-xs font-semibold text-brand-ring">
                          {row.initials}
                        </span>
                        {row.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-2 text-gray-300">
                        <Icon size={14} className="text-brand" />
                        {row.event}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{row.time}</td>
                    <td className="py-3 pr-1 text-right">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const styles =
    status === 'Completed'
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
