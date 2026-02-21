import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user;

  return (
    <div className="wrapper py-8 max-w-2xl">
      <h1 className="text-3xl mb-8">Profile</h1>

      {/* Avatar + identity */}
      <div className="surface p-6 flex items-center gap-5 mb-6">
        <UserAvatar user={user} size={64} />
        <div>
          <p
            className="font-semibold text-lg"
            style={{ color: "var(--color-text)" }}
          >
            {user.name}
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {user.email}
          </p>
          {user.username && (
            <Link
              href={`/u/${user.username}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-sm mt-1"
              style={{ color: "var(--color-brand)" }}
            >
              /{user.username}
              <ExternalLink size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Edit form */}
      <div className="surface p-6">
        <h2 className="text-xl mb-6">Edit profile</h2>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
