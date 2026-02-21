'use client'

import { useTransition } from 'react'
import { adminDeleteUser, adminPromoteUser } from '@/lib/actions'
import { Trash2, ShieldCheck } from 'lucide-react'

export default function AdminUserActions({ userId, role }: { userId: string; role: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex gap-1">
      {role !== 'ADMIN' && (
        <button
          title="Promote to admin"
          disabled={isPending}
          className="btn-icon"
          onClick={() => {
            if (!confirm('Promote this user to admin?')) return
            startTransition(() => adminPromoteUser(userId))
          }}
        >
          <ShieldCheck size={14} />
        </button>
      )}
      <button
        title="Delete user"
        disabled={isPending}
        className="btn-icon"
        style={{ color: '#DC2626' }}
        onClick={() => {
          if (!confirm('Delete this user and all their data?')) return
          startTransition(() => adminDeleteUser(userId))
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
