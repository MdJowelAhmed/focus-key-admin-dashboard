import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChevronDown } from 'lucide-react'

export type FocusTimeDatum = {
  date: string
  hours: number
}

type Props = {
  title: string
  data: FocusTimeDatum[]
  seriesLabel: string
  isLoading?: boolean
  selectedDays?: number
  onDaysChange?: (days: number) => void
  selectedYear?: number
  onYearChange?: (year: number) => void
  yearOptions?: number[]
}

const RANGE_OPTIONS = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 14 Days', days: 14 },
  { label: 'Last 30 Days', days: 30 },
]

export default function FocusTimeChart({
  title,
  data,
  seriesLabel,
  isLoading,
  selectedDays,
  onDaysChange,
  selectedYear,
  onYearChange,
  yearOptions = [2026, 2025, 2024],
}: Props) {
  const [openDays, setOpenDays] = useState(false)
  const [openYear, setOpenYear] = useState(false)
  const [internalDays, setInternalDays] = useState(7)

  const activeDays = selectedDays ?? internalDays
  const activeDaysLabel = RANGE_OPTIONS.find((r) => r.days === activeDays)?.label || `Last ${activeDays} Days`

  const handleSelectDays = (days: number) => {
    if (onDaysChange) {
      onDaysChange(days)
    } else {
      setInternalDays(days)
    }
    setOpenDays(false)
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>

        <div className="flex items-center gap-2">
          {/* Year Filter (If onYearChange or selectedYear is provided) */}
          {(selectedYear !== undefined || onYearChange !== undefined) && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenYear((v) => !v)
                  setOpenDays(false)
                }}
                className="flex items-center gap-2 rounded-md border border-surface-border bg-surface-elevated px-3 py-1.5 text-xs text-gray-200 hover:text-white"
              >
                {selectedYear ?? 2026}
                <ChevronDown size={14} />
              </button>
              {openYear && (
                <ul className="absolute right-0 z-10 mt-1 w-28 overflow-hidden rounded-md border border-surface-border bg-surface-elevated shadow-lg">
                  {yearOptions.map((yr) => (
                    <li key={yr}>
                      <button
                        type="button"
                        onClick={() => {
                          onYearChange?.(yr)
                          setOpenYear(false)
                        }}
                        className={`block w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-card ${
                          yr === selectedYear ? 'text-brand font-medium' : 'text-gray-200'
                        }`}
                      >
                        {yr}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Days Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenDays((v) => !v)
                setOpenYear(false)
              }}
              className="flex items-center gap-2 rounded-md border border-surface-border bg-surface-elevated px-3 py-1.5 text-xs text-gray-200 hover:text-white"
            >
              {activeDaysLabel}
              <ChevronDown size={14} />
            </button>
            {openDays && (
              <ul className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-md border border-surface-border bg-surface-elevated shadow-lg">
                {RANGE_OPTIONS.map((opt) => (
                  <li key={opt.days}>
                    <button
                      type="button"
                      onClick={() => handleSelectDays(opt.days)}
                      className={`block w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-card ${
                        opt.days === activeDays ? 'text-brand font-medium' : 'text-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>


      <div className="mt-1 text-xs text-gray-500">Minutes</div>

      <div className="mt-2 h-[260px] w-full">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Loading chart data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C4A97D" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#C4A97D" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#2e2e34" strokeDasharray="3 4" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  background: '#1c1c20',
                  border: '1px solid #2e2e34',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                }}
                cursor={{ stroke: '#C4A97D', strokeOpacity: 0.4 }}
                formatter={(v) => [`${v} mins`, seriesLabel]}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#C4A97D"
                strokeWidth={2}
                fill="url(#focusFill)"
                dot={{ r: 4, fill: '#C4A97D', stroke: '#1c1c20', strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-300">
        <span className="h-0.5 w-6 rounded bg-brand" />
        {seriesLabel}
      </div>
    </div>
  )
}
