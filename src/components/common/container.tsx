"use client";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide" | "full";
}

export function Container({ children, className, size = "default" }: ContainerProps) {
  const sizeClasses = {
    default: "max-w-6xl",
    narrow: "max-w-4xl",
    wide: "max-w-7xl",
    full: "max-w-none px-0",
  };

  return (
    <div className={cn("container mx-auto px-4 sm:px-6", sizeClasses[size], className)}>
      {children}
    </div>
  );
}
