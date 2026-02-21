import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { links } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LinkManager from "@/components/LinkManager";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, session.user.id))
    .orderBy(asc(links.order));

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
      <LinkManager initialLinks={userLinks} />
    </div>
  );
}
