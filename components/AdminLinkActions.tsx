'use client'

import { useTransition } from 'react'
import { adminDeleteLink } from '@/lib/actions'
import { Trash2 } from 'lucide-react'

export default function AdminLinkActions({ linkId }: { linkId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      title="Delete link"
      disabled={isPending}
      className="btn-icon"
      style={{ color: '#DC2626' }}
      onClick={() => {
        if (!confirm('Delete this link?')) return
        startTransition(() => adminDeleteLink(linkId))
      }}
    >
      {isPending ? <span className="spinner" /> : <Trash2 size={14} />}
    </button>
  )
}
