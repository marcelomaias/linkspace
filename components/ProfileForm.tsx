"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/actions";
import ImageUpload from "@/components/ImageUpload";
import UserAvatar from "@/components/UserAvatar";

interface Props {
  user: {
    id: string;
    name?: string | null;
    username?: string | null;
    pictureUrl?: string | null;
    image?: string | null;
  };
}

export default function ProfileForm({ user }: Props) {
  const [username, setUsername] = useState(user.username ?? "");
  const [pictureUrl, setPictureUrl] = useState(user.pictureUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("username", username);
    formData.set("pictureUrl", pictureUrl);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Picture upload */}
      <ImageUpload
        endpoint="profilePicture"
        value={pictureUrl || null}
        onChange={(url) => setPictureUrl(url ?? "")}
        shape="circle"
        size={56}
        label="Profile picture"
        disabled={isPending}
      />

      {/* Username */}
      <div className="form-group">
        <label className="form-label">Username</label>
        <div className="flex items-center">
          <span className="username-prefix">linkspace.app/u/</span>
          <input
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
              )
            }
            className="form-input rounded-l-none"
            placeholder="yourname"
            disabled={isPending}
            maxLength={30}
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {success && (
        <p className="text-sm" style={{ color: "#16A34A" }}>
          Profile updated!
        </p>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? (
            <>
              <span className="spinner" /> Saving...
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}
