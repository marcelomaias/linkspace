import { db } from "@/lib/db";
import { users, links } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import UserAvatar from "@/components/UserAvatar";
import AdminUserActions from "@/components/AdminUserActions";

export default async function AdminUsersPage() {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      username: users.username,
      role: users.role,
      pictureUrl: users.pictureUrl,
      image: users.image,
      createdAt: users.createdAt,
      linkCount: sql<number>`count(${links.id})::int`,
    })
    .from(users)
    .leftJoin(links, eq(links.userId, users.id))
    .groupBy(users.id)
    .orderBy(users.createdAt);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">
          Users <span className="badge-neutral ml-2">{rows.length}</span>
        </h1>
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
            {rows.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size={32} />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>
                  {user.username ? `@${user.username}` : "—"}
                </td>
                <td>
                  <span
                    className={
                      user.role === "ADMIN" ? "badge-brand" : "badge-neutral"
                    }
                  >
                    {user.role}
                  </span>
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>
                  {user.linkCount}
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>
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
  );
}
