import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  value: string
  valueSuffix?: string
  delta?: string
  deltaLabel?: string
  icon: LucideIcon
}

export default function DeltaStatCard({
  label,
  value,
  valueSuffix,

  icon: Icon,
}: Props) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/15 text-brand">
          <Icon size={16} />
        </span>
        <span className="whitespace-pre-line leading-tight">{label}</span>
      </div>
      <div className="mt-4 flex items-baseline gap-1 text-3xl font-semibold text-white">
        <span>{value}</span>
        {valueSuffix && (
          <span className="text-xl font-semibold text-white">{valueSuffix}</span>
        )}
      </div>
      {/* {delta && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className="text-accent-success">↗ {delta}</span>
          <span className="text-gray-500">{deltaLabel}</span>
        </div>
      )} */}
    </div>
  )
}
