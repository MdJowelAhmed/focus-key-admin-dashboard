import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface-page px-4 py-12 text-gray-100">
      <div className="flex w-full items-center justify-center">
        {children}
      </div>
    </div>
  )
}
