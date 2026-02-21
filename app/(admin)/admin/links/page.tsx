import { db } from "@/lib/db";
import { links, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import AdminLinkActions from "@/components/AdminLinkActions";
import { removeHttp } from "@/lib/utils";

export default async function AdminLinksPage() {
  const rows = await db
    .select({
      id: links.id,
      label: links.label,
      url: links.url,
      createdAt: links.createdAt,
      userName: users.name,
      userUsername: users.username,
    })
    .from(links)
    .leftJoin(users, eq(links.userId, users.id))
    .orderBy(links.createdAt);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">
          Links <span className="badge-neutral ml-2">{rows.length}</span>
        </h1>
      </div>

      <div className="surface overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>URL</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="font-medium">{row.label}</td>
                <td style={{ color: "var(--color-text-muted)" }}>
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {removeHttp(row.url)}
                  </a>
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>
                  {row.userName}
                  {row.userUsername && (
                    <span
                      className="ml-1 text-xs"
                      style={{ color: "var(--color-text-subtle)" }}
                    >
                      @{row.userUsername}
                    </span>
                  )}
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>
                  {new Date(row.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <AdminLinkActions linkId={row.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
