import Header from '@/components/Header'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-56px)]">{children}</main>
    </>
  )
}
