type Props = {
  src?: string
  alt: string
}

export default function AuthIllustration({ src = '/auth_illustration.jpg', alt }: Props) {
  return (
    <div className="relative flex w-full max-w-[560px] items-center justify-center overflow-hidden rounded-3xl border border-surface-border/50 bg-surface-card/40 p-3 shadow-2xl backdrop-blur-md">
      <img
        src={src}
        alt={alt}
        className="h-auto max-h-[480px] w-full rounded-2xl object-cover shadow-lg transition-transform duration-500 hover:scale-[1.01]"
      />
    </div>
  )
}
