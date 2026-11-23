import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "lime" | "outline" | "ghost" | "danger" | "secondary" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 font-bold tracking-tight select-none transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
        {
          // Primary Cyan Glow
          "bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20 hover:from-cyan-300 hover:to-teal-300 hover:shadow-cyan-400/40 hover:-translate-y-0.5":
            variant === "primary",
          // Energetic Lime
          "bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 shadow-md shadow-lime-500/20 hover:from-lime-300 hover:to-emerald-300 hover:shadow-lime-400/40 hover:-translate-y-0.5":
            variant === "lime",
          // Glass Outline
          "border border-white/20 bg-white/[0.06] text-white backdrop-blur-sm hover:bg-white/15 hover:border-cyan-400/60 hover:text-cyan-200":
            variant === "outline",
          // Ghost
          "bg-transparent text-slate-300 hover:bg-white/10 hover:text-white":
            variant === "ghost",
          // Danger
          "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-900/30 hover:from-rose-500 hover:to-red-500":
            variant === "danger",
          // Secondary subtle
          "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700/60":
            variant === "secondary",
          // Neon Glow special
          "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_30px_rgba(6,182,212,0.85)] hover:bg-cyan-400 hover:-translate-y-0.5":
            variant === "glow",
        },
        {
          "rounded-xl px-3.5 py-1.5 text-xs": size === "sm",
          "rounded-xl px-5 py-2.5 text-sm": size === "md",
          "rounded-2xl px-7 py-3.5 text-base": size === "lg",
          "h-10 w-10 rounded-xl p-0": size === "icon",
        },
        className
      )}
      {...props}
    />
  );
}
