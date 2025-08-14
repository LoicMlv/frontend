import React from "react";
import { cn } from "../../lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export const Button: React.FC<Props> = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const v =
    variant === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400"
  : variant === "secondary" ? "bg-zinc-800 hover:bg-zinc-700 text-white focus:ring-zinc-400"
  : variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400"
  : "bg-transparent hover:bg-zinc-800 text-zinc-200 focus:ring-zinc-500";
  const s =
    size === "sm" ? "px-3 py-1.5 text-sm"
  : size === "lg" ? "px-5 py-3 text-base"
  : "px-4 py-2 text-sm";

  return <button className={cn(base, v, s, className)} {...props} />;
};
