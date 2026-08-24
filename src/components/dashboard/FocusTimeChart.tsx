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
}

const RANGES = ['Last 7 Days', 'Last 14 Days', 'Last 30 Days']

export default function FocusTimeChart({ title, data, seriesLabel }: Props) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState(RANGES[0])

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md border border-surface-border bg-surface-elevated px-3 py-1.5 text-xs text-gray-200 hover:text-white"
          >
            {range}
            <ChevronDown size={14} />
          </button>
          {open && (
            <ul className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-md border border-surface-border bg-surface-elevated shadow-lg">
              {RANGES.map((r) => (
                <li key={r}>
                  <button
                    type="button"
                    onClick={() => {
                      setRange(r)
                      setOpen(false)
                    }}
                    className={`block w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-card ${
                      r === range ? 'text-brand' : 'text-gray-200'
                    }`}
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-1 text-xs text-gray-500">Hours</div>

      <div className="mt-2 h-[260px] w-full">
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
              domain={[0, 250]}
              ticks={[0, 50, 100, 150, 200, 250]}
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
              formatter={(v) => [`${v} h`, seriesLabel]}
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
      </div>

      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-300">
        <span className="h-0.5 w-6 rounded bg-brand" />
        {seriesLabel}
      </div>
    </div>
  )
}
