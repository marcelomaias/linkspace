import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LinkManager from "@/components/LinkManager";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  return (
    <div className="wrapper py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl">My Links</h1>
          <p className="text-sm mt-1">Manage and reorder your public links</p>
        </div>
        {session.user.username && (
          <Link
            href={`/u/${session.user.username}`}
            target="_blank"
            className="btn-secondary gap-1.5 text-sm"
          >
            <ExternalLink size={14} />
            View profile
          </Link>
        )}
      </div>
      <LinkManager initialLinks={links} />
    </div>
  );
}
