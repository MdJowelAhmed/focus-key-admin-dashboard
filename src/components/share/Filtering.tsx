import { Select } from 'antd'
import { cn } from '@/utils/cn'

export interface FilteringOption {
  label: string
  value: string
}

export interface FilteringField {
  key: string
  placeholder?: string
  options: FilteringOption[]
  value?: string
  onChange: (value: string) => void
  allowClear?: boolean
  className?: string
  /** Minimum width in px. Defaults to 180. */
  minWidth?: number
}

interface FilteringProps {
  fields: FilteringField[]
  className?: string
  /** `standalone` wraps in a card. `inline` is just the row. */
  variant?: 'standalone' | 'inline'
}

/** Keep in sync with SearchingInput (`!h-[45px]`). */
const selectClassName = cn(
  '!h-[45px]',
  '[&_.ant-select-selector]:!h-[45px]',
  '[&_.ant-select-selector]:!min-h-[45px]',
  '[&_.ant-select-selector]:!rounded-xl',
  '[&_.ant-select-selector]:!border-surface-border',
  '[&_.ant-select-selector]:!bg-surface-elevated/70',
  '[&_.ant-select-selector]:!px-3.5',
  '[&_.ant-select-selector]:!py-0',
  '[&_.ant-select-selector]:!flex',
  '[&_.ant-select-selector]:!items-center',
  '[&_.ant-select-selector]:!shadow-none',
  '[&_.ant-select-selection-wrap]:!h-full',
  '[&_.ant-select-selection-wrap]:!flex',
  '[&_.ant-select-selection-wrap]:!items-center',
  '[&_.ant-select-selection-item]:!leading-none',
  '[&_.ant-select-selection-item]:!text-white',
  '[&_.ant-select-selection-item]:!font-normal',
  '[&_.ant-select-selection-item]:!text-sm',
  '[&_.ant-select-selection-placeholder]:!leading-none',
  '[&_.ant-select-selection-placeholder]:!text-gray-500',
  '[&_.ant-select-selection-placeholder]:!font-normal',
  '[&_.ant-select-selection-placeholder]:!text-sm',
  '[&_.ant-select-arrow]:!text-gray-400',
  '[&_.ant-select-clear]:!text-gray-400',
  '[&_.ant-select-clear]:!bg-transparent',
)

export function Filtering({
  fields,
  className,
  variant = 'standalone',
}: FilteringProps) {
  if (!fields.length) return null

  const content = (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center',
        variant === 'inline' && className,
      )}
    >
      {fields.map((field) => (
        <Select
          key={field.key}
          allowClear={field.allowClear ?? true}
          placeholder={field.placeholder ?? 'Filter'}
          value={field.value || undefined}
          onChange={(next) => field.onChange(next ?? '')}
          options={field.options}
          className={cn(selectClassName, field.className)}
          style={{ minWidth: field.minWidth ?? 180, height: 45 }}
          popupMatchSelectWidth={false}
          popupClassName="!bg-surface-elevated !border !border-surface-border !rounded-xl overflow-hidden [&_.ant-select-item]:!text-gray-200 [&_.ant-select-item-option-selected]:!bg-brand/20 [&_.ant-select-item-option-selected]:!text-brand [&_.ant-select-item-option-active]:!bg-surface-card"
        />
      ))}
    </div>
  )

  if (variant === 'inline') {
    return content
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-surface-border bg-surface-elevated/70 mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center',
        className,
      )}
    >
      {content}
    </div>
  )
}
