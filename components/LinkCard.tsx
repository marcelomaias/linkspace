import Image from "next/image";
import type { Link } from "@/lib/schema";
import { removeHttp } from "@/lib/utils";
import { LinkIcon } from "lucide-react";

export default function LinkCard({
  link,
  draggable = false,
}: {
  link: Link;
  draggable?: boolean;
}) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-card"
      style={{ paddingLeft: draggable ? "2.5rem" : "1rem" }}
    >
      {/* Icon */}
      <div className="link-card-icon">
        {link.iconUrl ? (
          <Image
            src={link.iconUrl}
            alt={link.label}
            width={40}
            height={40}
            className="rounded-lg object-cover"
          />
        ) : (
          <span className="link-card-icon-placeholder">
            <LinkIcon size={18} />
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        <span className="link-card-label">{link.label}</span>
        <span className="link-card-url">{removeHttp(link.url)}</span>
      </div>
    </a>
  );
}
