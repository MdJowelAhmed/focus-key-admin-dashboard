import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { imageUrl } from './getImageUrl'

export interface AvatarProps {
  src?: string | null
  name?: string | null
  className?: string
  iconClassName?: string
  textClassName?: string
  showFallbackIcon?: boolean
  alt?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  className = 'h-10 w-10 bg-brand/30 text-brand-ring',
  iconClassName = 'h-1/2 w-1/2',
  textClassName = '',
  showFallbackIcon = false,
  alt = '',
}) => {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [src])

  const fullImageUrl = src ? imageUrl(src) : ''

  const initials = name
    ? name
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : ''

  const hasValidImage = Boolean(fullImageUrl) && !imageError

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none ${className}`}
    >
      {hasValidImage ? (
        <img
          src={fullImageUrl}
          alt={alt || name || 'User avatar'}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : showFallbackIcon || !initials ? (
        <User className={`shrink-0 ${iconClassName}`} />
      ) : (
        <span className={textClassName}>{initials}</span>
      )}
    </div>
  )
}

export default Avatar
