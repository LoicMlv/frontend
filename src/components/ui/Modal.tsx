import React, { useEffect } from "react";
import { cn } from "../../lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
};

export const Modal: React.FC<Props> = ({ open, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const w = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : size === "xl" ? "max-w-5xl" : "max-w-xl";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={cn("w-full", w, "rounded-2xl bg-zinc-900 text-zinc-100 shadow-2xl border border-zinc-800")}>
          {title && <div className="px-4 py-3 border-b border-zinc-800 text-lg font-semibold">{title}</div>}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
