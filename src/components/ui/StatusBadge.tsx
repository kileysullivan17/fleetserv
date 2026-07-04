import { cn } from "@/utils/cn";

type BadgeVariant =
  | "draft"
  | "quoted"
  | "approved"
  | "invoiced"
  | "paid"
  | "sent"
  | "accepted"
  | "declined"
  | "overdue";

const variantClasses: Record<BadgeVariant, string> = {
  draft: "bg-status-draft-bg text-status-draft",
  quoted: "bg-status-quoted-bg text-status-quoted",
  approved: "bg-status-approved-bg text-status-approved",
  invoiced: "bg-status-invoiced-bg text-status-invoiced",
  paid: "bg-status-paid-bg text-status-paid",
  sent: "bg-status-sent-bg text-status-sent",
  accepted: "bg-status-accepted-bg text-status-accepted",
  declined: "bg-status-declined-bg text-status-declined",
  overdue: "bg-status-overdue-bg text-status-overdue",
};

interface StatusBadgeProps {
  status: BadgeVariant;
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[status],
        className
      )}
    >
      {label}
    </span>
  );
}
