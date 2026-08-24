import {
  Activity,
  Clock,
  Coffee,
  Heart,
  Lock,
  ShieldCheck,
  Timer,
  Users as UsersIcon,
  UserCheck,
  UsersRound,
} from 'lucide-react'
import DeltaStatCard from '../../components/dashboard/DeltaStatCard'
import FocusTimeChart, { type FocusTimeDatum } from '../../components/dashboard/FocusTimeChart'

const headlineStats = [
  { label: 'Total Users', value: '12,482', delta: '8.6%', icon: UsersIcon },
  { label: 'Activated Users', value: '8,932', delta: '12.3%', icon: UserCheck },
  { label: '7-Day Active Users', value: '6,125', delta: '9.4%', icon: Activity },
  { label: 'Focus Sessions\nThis Week', value: '2,341', delta: '10.7%', icon: Clock },
  {
    label: 'Avg. Session Length',
    value: '42',
    valueSuffix: 'm 18s',
    delta: '6.2%',
    icon: Timer,
  },
]

const focusTimeData: FocusTimeDatum[] = [
  { date: 'May 2', hours: 118 },
  { date: 'May 3', hours: 96 },
  { date: 'May 4', hours: 138 },
  { date: 'May 5', hours: 200 },
  { date: 'May 6', hours: 168 },
  { date: 'May 7', hours: 151 },
  { date: 'May 8', hours: 190 },
]

const funnelSteps = [
  { step: 1, label: 'Registered', count: 12482, percent: 100 },
  { step: 2, label: 'Key Linked', count: 9876, percent: 79.1 },
  { step: 3, label: 'First Session Started', count: 7102, percent: 56.9 },
  { step: 4, label: 'First Session Completed', count: 5432, percent: 43.5 },
]

const keyStats = [
  { label: 'Breaks Taken', value: '4,862', delta: '11.2%', icon: Coffee },
  { label: 'Unlock Attempts', value: '18,732', delta: '9.3%', icon: Lock },
  { label: 'Cooldown Completed', value: '6,421', delta: '7.8%', icon: ShieldCheck },
  { label: 'Users With Partners', value: '3,218', delta: '8.9%', icon: UsersIcon },
  { label: 'Joint Sessions', value: '1,653', delta: '10.4%', icon: UsersRound },
  {
    label: 'Time Focused Together',
    value: '812',
    valueSuffix: 'h 34m',
    delta: '12.6%',
    icon: Heart,
  },
]

export default function Business() {
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
            title="Focus Time Over Time"
            data={focusTimeData}
            seriesLabel="Focus Time (Hours)"
          />
        </div>

        <div className="lg:col-span-2">
          <FunnelCard steps={funnelSteps} />
        </div>
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
                {s.valueSuffix && (
                  <span className="text-lg font-semibold text-white">{s.valueSuffix}</span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px]">
                <span className="text-accent-success">↗ {s.delta}</span>
                <span className="text-gray-500">vs last 7 days</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

type FunnelStep = { step: number; label: string; count: number; percent: number }

function FunnelCard({ steps }: { steps: FunnelStep[] }) {
  const formatter = new Intl.NumberFormat('en-US')
  const conversion = steps[steps.length - 1].percent
  return (
    <div className="flex h-full flex-col rounded-2xl border border-surface-border bg-surface-card p-5">
      <h3 className="text-base font-semibold text-white">Onboarding Funnel</h3>
      <div className="mt-5 flex flex-1 flex-col gap-3">
        {steps.map((s, idx) => (
          <div key={s.step}>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/40 bg-brand/15 text-xs font-semibold text-brand">
                {s.step}
              </span>
              <span className="flex-1 text-sm text-gray-200">{s.label}</span>
              <span className="text-sm font-medium text-gray-200">
                {formatter.format(s.count)}
              </span>
              <span className="w-12 text-right text-sm font-medium text-gray-200">
                {s.percent}%
              </span>
            </div>
            <div className="mt-2 ml-9 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-hover"
                style={{ width: `${s.percent}%` }}
              />
            </div>
            {idx < steps.length - 1 && (
              <div className="ml-9 mt-1 text-xs text-gray-600">↓</div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-surface-border pt-3 text-xs text-gray-400">
        Conversion rate (Registered → Completed):{' '}
        <span className="font-semibold text-brand">{conversion}%</span>
      </div>
    </div>
  )
}
