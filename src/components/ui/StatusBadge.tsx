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

// The design ships six chip grounds (draft, sent, accepted, invoiced, paid,
// overdue). The app carries three more statuses across the visit / quote /
// invoice flows; each maps onto the nearest designed ground by meaning. The
// label text always rides along, so a status is never told by color alone
// (WCAG 1.4.1): QUOTED and SENT share a blue ground but read differently.
type ChipGround =
  | "draft"
  | "sent"
  | "accepted"
  | "invoiced"
  | "paid"
  | "overdue";

const groundFor: Record<BadgeVariant, ChipGround> = {
  draft: "draft",
  quoted: "sent",
  sent: "sent",
  approved: "accepted",
  accepted: "accepted",
  invoiced: "invoiced",
  paid: "paid",
  declined: "overdue",
  overdue: "overdue",
};

interface StatusBadgeProps {
  status: BadgeVariant;
  label: string;
  /** Denser chip for tables and history rows. */
  mini?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  mini = false,
  className,
}: StatusBadgeProps) {
  return (
    <span
      data-status={groundFor[status]}
      className={cn("fs-chip", mini && "fs-chip--mini", className)}
    >
      {label}
    </span>
  );
}
