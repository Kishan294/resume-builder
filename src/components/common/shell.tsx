"use client";

import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div
      className={cn("grid items-start gap-8 pb-8 pt-6 md:py-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
