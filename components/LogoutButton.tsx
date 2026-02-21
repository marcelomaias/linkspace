'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleLogout = async () => {
    setPending(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} disabled={pending} className="btn-ghost text-sm gap-1.5">
      {pending ? <span className="spinner" /> : <LogOut size={14} />}
      <span className="hidden sm:inline">Logout</span>
    </button>
  )
}
