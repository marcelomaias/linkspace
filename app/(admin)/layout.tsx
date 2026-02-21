import Header from "@/components/Header";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="wrapper py-8">
        <div className="flex items-center gap-2 mb-8">
          <span className="badge-brand">Admin</span>
          <nav className="flex gap-4 ml-4">
            <Link href="/admin/users" className="nav-link font-medium">
              Users
            </Link>
            <Link href="/admin/links" className="nav-link font-medium">
              Links
            </Link>
          </nav>
        </div>
        {children}
      </div>
    </>
  );
}
