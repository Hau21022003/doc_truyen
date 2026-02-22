import { BaseComponentProps } from "@/shared/types";

export function TableHeader({ className = "", children }: BaseComponentProps) {
  return (
    <thead className={`bg-card backdrop-blur-sm ${className}`}>
      {children}
    </thead>
  );
}
