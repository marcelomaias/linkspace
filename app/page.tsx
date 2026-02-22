import Header from "@/components/Header";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect("/dashboard");

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="hero-strip min-h-[60vh] flex items-center">
          <div className="wrapper py-20">
            <p className="section-title text-white/60 mb-4">
              Link-in-bio, simplified
            </p>
            <h1 className="text-white text-5xl md:text-7xl max-w-2xl leading-none mb-6">
              Your links,
              <br />
              your space.
            </h1>
            <p className="text-white/70 text-lg max-w-md mb-10">
              A clean, minimal home for everything you share online. One link.
              All your links.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/signup"
                className="btn bg-white text-(--color-brand) font-semibold hover:bg-white/90 px-6 py-3"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/login"
                className="btn border border-white/30 text-white hover:bg-white/10 px-6 py-3"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="wrapper py-20 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "One link",
              body: "Share one URL and let your audience find everything you create.",
            },
            {
              title: "Drag to reorder",
              body: "Arrange your links exactly how you want them with simple drag and drop.",
            },
            {
              title: "Dark mode",
              body: "Looks great day or night. Toggle between light and dark with one click.",
            },
          ].map((f) => (
            <div key={f.title} className="surface p-6">
              <h3
                className="text-lg mb-2"
                style={{ color: "var(--color-text)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm">{f.body}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
