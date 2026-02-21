'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth-client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPending(true)

    const { error } = await signIn.email({ email, password })

    if (error) {
      setError(error.message ?? 'Login failed')
      setPending(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="text-2xl">Welcome back</h1>
        <p className="text-sm mt-1">Sign in to your LinkSpace account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="you@example.com"
            required
            disabled={pending}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="••••••••"
            required
            disabled={pending}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={pending} className="btn-primary w-full mt-2">
          {pending ? <><span className="spinner" /> Signing in...</> : 'Sign in'}
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="auth-link">Sign up</Link>
      </p>
    </div>
  )
}
