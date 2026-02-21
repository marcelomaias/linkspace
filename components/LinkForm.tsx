"use client";

import { useActionState, useState } from "react";
import type { Link } from "@/lib/schema";
import { createLink, updateLink } from "@/lib/actions";
import ImageUpload from "@/components/ImageUpload";

interface Props {
  link?: Link;
  onOptimistic: (link: Link) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LinkForm({
  link,
  onOptimistic,
  onSuccess,
  onCancel,
}: Props) {
  const [iconUrl, setIconUrl] = useState<string | null>(link?.iconUrl ?? null);

  async function action(_: unknown, formData: FormData) {
    const label = formData.get("label") as string;
    const url = formData.get("url") as string;

    onOptimistic({
      id: link?.id ?? String(Math.random()),
      label,
      url,
      iconUrl: iconUrl,
      order: link?.order ?? 0,
      userId: link?.userId ?? "",
      createdAt: link?.createdAt ?? new Date(),
      updatedAt: new Date(),
    });

    // Inject the iconUrl into formData so the server action can read it
    formData.set("iconUrl", iconUrl ?? "");

    try {
      if (link) {
        await updateLink(link.id, formData);
      } else {
        await createLink(formData);
      }
      onSuccess();
      return { error: null };
    } catch {
      return { error: "Failed to save link." };
    }
  }

  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error && <p className="form-error">{state.error}</p>}

      <div className="form-group">
        <label className="form-label">Label</label>
        <input
          name="label"
          defaultValue={link?.label}
          placeholder="My GitHub"
          className="form-input"
          required
          disabled={isPending}
        />
      </div>

      <div className="form-group">
        <label className="form-label">URL</label>
        <input
          name="url"
          type="url"
          defaultValue={link?.url}
          placeholder="https://..."
          className="form-input"
          required
          disabled={isPending}
        />
      </div>

      <ImageUpload
        endpoint="linkIcon"
        value={iconUrl}
        onChange={setIconUrl}
        shape="square"
        size={48}
        label="Icon (optional)"
        disabled={isPending}
      />

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="btn-secondary text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary text-sm"
        >
          {isPending ? (
            <>
              <span className="spinner" /> Saving...
            </>
          ) : link ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  );
}
