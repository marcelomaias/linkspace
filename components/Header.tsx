import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DarkModeToggle from "@/components/DarkModeToggle";
import LogoutButton from "@/components/LogoutButton";
import UserAvatar from "@/components/UserAvatar";

export default async function Header() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  return (
    <header className="surface-header">
      <div className="wrapper flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="logo">
          Link<span className="logo-accent">Space</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="nav-link px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-2)] dark:hover:bg-[var(--color-surface-2-dark)]"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 nav-link px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-2)] dark:hover:bg-[var(--color-surface-2-dark)]"
              >
                <UserAvatar user={user} size={22} />
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/links"
                  className="nav-link px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-2)] dark:hover:bg-[var(--color-surface-2-dark)]"
                >
                  Admin
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link px-3 py-1.5">
                Login
              </Link>
              <Link href="/signup" className="btn-primary text-sm px-4 py-1.5">
                Sign up
              </Link>
            </>
          )}
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
