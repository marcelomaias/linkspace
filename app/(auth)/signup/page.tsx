"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { generateUsername } from "@/lib/utils";
import ImageUpload from "@/components/ImageUpload";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setPending(true);

    const { error } = await signUp.email({
      name,
      email,
      password,
      // @ts-expect-error — custom fields via additionalFields
      username: generateUsername(email),
      image: pictureUrl ?? undefined,
    });

    if (error) {
      setError(error.message ?? "Registration failed");
      setPending(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="text-2xl">Create account</h1>
        <p className="text-sm mt-1">Start sharing your links with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Profile picture — shown first so it feels like an avatar setup */}
        <ImageUpload
          endpoint="signupPicture"
          value={pictureUrl}
          onChange={setPictureUrl}
          shape="circle"
          size={64}
          label="Profile picture"
          disabled={pending}
        />

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Your name"
            required
            disabled={pending}
            autoComplete="name"
          />
        </div>

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
            placeholder="Min. 8 characters"
            required
            disabled={pending}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="form-input"
            placeholder="••••••••"
            required
            disabled={pending}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary w-full mt-2"
        >
          {pending ? (
            <>
              <span className="spinner" /> Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
