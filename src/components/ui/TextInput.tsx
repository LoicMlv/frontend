import React from "react";
import { cn } from "../../lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string };
export const TextInput: React.FC<Props> = ({ className, label, hint, ...props }) => {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm text-zinc-300">{label}</span>}
      <input
        {...props}
        className={cn(
          "w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
      />
      {hint && <span className="text-xs text-zinc-500">{hint}</span>}
    </label>
  );
};
