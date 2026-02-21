import Image from 'next/image'
import { User } from 'lucide-react'

interface Props {
  user: { name?: string | null; pictureUrl?: string | null; image?: string | null }
  size?: number
}

export default function UserAvatar({ user, size = 32 }: Props) {
  const src = user.pictureUrl || user.image

  if (src) {
    return (
      <Image
        src={src}
        alt={user.name ?? 'Avatar'}
        width={size}
        height={size}
        className="avatar"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className="avatar inline-flex items-center justify-center bg-[var(--color-brand)] text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {user.name ? user.name[0].toUpperCase() : <User size={size * 0.5} />}
    </span>
  )
}
