import { prisma } from "@/lib/prisma";
import AdminLinkActions from "@/components/AdminLinkActions";
import { removeHttp } from "@/lib/utils";

export default async function AdminLinksPage() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, username: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">
          Links <span className="badge-neutral ml-2">{links.length}</span>
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
            {links.map((link) => (
              <tr key={link.id}>
                <td className="font-medium">{link.label}</td>
                <td style={{ color: "var(--color-text-muted)" }}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {removeHttp(link.url)}
                  </a>
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>
                  {link.user.name}
                  {link.user.username && (
                    <span
                      className="ml-1 text-xs"
                      style={{ color: "var(--color-text-subtle)" }}
                    >
                      @{link.user.username}
                    </span>
                  )}
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>
                  {new Date(link.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <AdminLinkActions linkId={link.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
