import { prisma } from '@/lib/prisma'
import UserAvatar from '@/components/UserAvatar'
import AdminUserActions from '@/components/AdminUserActions'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { links: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Users <span className="badge-neutral ml-2">{users.length}</span></h1>
      </div>

      <div className="surface overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Username</th>
              <th>Role</th>
              <th>Links</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size={32} />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }}>
                  {user.username ? `@${user.username}` : '—'}
                </td>
                <td>
                  <span className={user.role === 'ADMIN' ? 'badge-brand' : 'badge-neutral'}>
                    {user.role}
                  </span>
                </td>
                <td style={{ color: 'var(--color-text-muted)' }}>{user._count.links}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <AdminUserActions userId={user.id} role={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
