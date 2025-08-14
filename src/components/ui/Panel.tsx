import React from "react";
import { cn } from "../../lib/cn";

export const Panel: React.FC<{ className?: string; title?: string; children?: React.ReactNode }> = ({ className, title, children }) => {
  return (
    <div className={cn("rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm", className)}>
      {title && <div className="px-4 py-3 border-b border-zinc-800 text-sm font-semibold">{title}</div>}
      <div className="p-4">{children}</div>
    </div>
  );
};
