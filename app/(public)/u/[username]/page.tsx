import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import LinkCard from "@/components/LinkCard";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  return { title: `@${username} — LinkSpace` };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: { orderBy: { order: "asc" } },
    },
  });

  if (!user) notFound();

  return (
    <div className="public-profile">
      {/* Hero header */}
      <div className="hero-strip py-16">
        <div className="wrapper flex flex-col items-center gap-4 text-center">
          <UserAvatar user={user} size={96} />
          <div>
            <h1 className="text-white text-3xl">@{user.username}</h1>
            <p className="text-white/70 text-sm mt-1">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="wrapper max-w-xl py-10">
        {user.links.length === 0 ? (
          <p
            className="text-center text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            No links yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {user.links.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
