import Header from '@/components/Header'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </>
  )
}
