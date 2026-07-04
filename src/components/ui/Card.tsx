import { cn } from "@/utils/cn";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-card shadow-card border border-brand-sand-dark",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-brand-sand-dark",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

export function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}
