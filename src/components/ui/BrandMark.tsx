import { cn } from "@/utils/cn";

type Tone = "navy" | "light";
type Size = "sm" | "md" | "lg";

interface BrandMarkProps {
  /** "navy" for dark chrome (sidebar, headers); "light" for paper and light bg. */
  tone?: Tone;
  size?: Size;
  /** Uppercase subline under the wordmark. Pass false to hide it. */
  subline?: string | false;
  className?: string;
}

const BAR: Record<Size, string> = {
  sm: "h-4 w-[6.5px]",
  md: "h-5 w-2",
  lg: "h-[26px] w-[11px]",
};

const WORD: Record<Size, string> = {
  sm: "text-[15px]",
  md: "text-lg",
  lg: "text-[26px]",
};

const SUBLINE: Record<Size, string> = {
  sm: "text-[8px] tracking-[0.16em]",
  md: "text-[9px] tracking-[0.18em]",
  lg: "text-[10px] tracking-[0.18em]",
};

// The FleetServ mark: two skewed bars (teal + anchor) plus the italic wordmark.
// Matches the design boards' letterhead and chrome.
export function BrandMark({
  tone = "navy",
  size = "md",
  subline = false,
  className,
}: BrandMarkProps) {
  const wordColor = tone === "navy" ? "text-white" : "text-fs-navy-900";
  const secondBar = tone === "navy" ? "bg-white" : "bg-fs-navy-900";
  const sublineColor = tone === "navy" ? "text-fs-teal-200" : "text-fs-ink-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex flex-shrink-0 gap-[3px]">
        <span
          className={cn(BAR[size], "-skew-x-[16deg] rounded-[1.5px] bg-fs-teal-500")}
        />
        <span
          className={cn(BAR[size], "-skew-x-[16deg] rounded-[1.5px]", secondBar)}
        />
      </div>
      <div className="leading-none">
        <span
          className={cn(
            "font-extrabold italic tracking-[0.04em]",
            WORD[size],
            wordColor
          )}
        >
          FLEETSERV
        </span>
        {subline && (
          <span
            className={cn(
              "mt-1 block font-bold uppercase",
              SUBLINE[size],
              sublineColor
            )}
          >
            {subline}
          </span>
        )}
      </div>
    </div>
  );
}
