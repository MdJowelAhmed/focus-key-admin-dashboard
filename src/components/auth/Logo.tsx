type Props = {
  size?: number
  showWordmark?: boolean
}

export default function Logo({ size = 40, showWordmark = true }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center"
        style={{ height: size, width: size }}
      >
        <img
          src="/logo.png"
          alt="Focus Key Logo"
          className="h-full w-full object-contain"
        />
      </div>
      {showWordmark && (
        <div className="text-lg font-semibold leading-none">
          <span className="text-white">Focus </span>
          <span className="text-brand">Key</span>
        </div>
      )}
    </div>
  )
}
