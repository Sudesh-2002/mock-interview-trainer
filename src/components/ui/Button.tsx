import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

export function buttonStyles(variant: Variant = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50",
    variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-500",
    variant === "secondary" &&
      "border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
    className
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}