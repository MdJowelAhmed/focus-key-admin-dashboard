type Props = {
  height?: number
  width?: number
}

export default function Logo({ height = 40, width = 120 }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center"
        style={{ height, width }}
      >
        <img
          src="/logo3.png"
          alt="Focus Key Logo"
          className="h-full w-full object-cover rounded-lg"
        />
      </div>
 
    </div>
  )
}
