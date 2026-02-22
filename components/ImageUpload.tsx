"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type Endpoint = keyof OurFileRouter;

interface Props {
  endpoint: Endpoint;
  value?: string | null;
  onChange: (url: string | null) => void;
  shape?: "circle" | "square";
  size?: number;
  label?: string;
  maxWidth?: number;
  maxHeight?: number;
  disabled?: boolean;
}

function validateDimensions(
  file: File,
  maxWidth: number,
  maxHeight: number,
): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve(
          `Image must be ${maxWidth}×${maxHeight}px or smaller (yours is ${img.width}×${img.height})`,
        );
      } else {
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export default function ImageUpload({
  endpoint,
  value,
  onChange,
  shape = "square",
  size = 56,
  label,
  maxWidth = 128,
  maxHeight = 128,
  disabled = false,
}: Props) {
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [error, setError] = useState<string | null>(null);

  const borderRadius = shape === "circle" ? "50%" : "0.5rem";

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="form-label">{label}</span>}

      <div className="flex items-center gap-3 overflow-hidden">
        {/* Preview */}
        {preview && (
          <div
            style={{
              width: size,
              height: size,
              borderRadius,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={preview.startsWith("blob:")}
            />
          </div>
        )}

        <div className="flex flex-col gap-1 overflow-hidden min-w-0 flex-1">
          <UploadButton
            endpoint={endpoint}
            disabled={disabled}
            onBeforeUploadBegin={async (files) => {
              setError(null);
              const file = files[0];
              if (!file) return files;
              setPreview(URL.createObjectURL(file));
              const err = await validateDimensions(file, maxWidth, maxHeight);
              if (err) {
                setError(err);
                setPreview(null);
                return [];
              }
              return files;
            }}
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.url;
              if (url) {
                setPreview(url);
                onChange(url);
              }
            }}
            onUploadError={(err) => {
              setError(err.message ?? "Upload failed");
            }}
            appearance={{
              button:
                "btn-secondary text-sm !w-full \
                !text-[var(--color-text)] \
                [&_svg]:w-4 [&_svg]:h-4 \
                [&_svg]:text-[var(--color-text)] \
                [&>span]:truncate [&>span]:block",
              allowedContent: "hidden",
            }}
          />

          {preview && !disabled && (
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onChange(null);
              }}
              className="text-xs text-left"
              style={{ color: "var(--color-text-subtle)" }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
