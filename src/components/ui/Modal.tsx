import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/utils/cn";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-brand-navy/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-lg bg-white shadow-xl border border-brand-sand-dark",
            "max-h-[85vh] overflow-y-auto",
            className
          )}
        >
          <div className="flex items-start justify-between px-6 py-4 border-b border-brand-sand-dark">
            <div>
              <Dialog.Title className="text-base font-semibold text-brand-navy">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-sm text-gray-500">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="rounded p-1 text-gray-400 hover:text-brand-navy hover:bg-brand-sand transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Dialog.Close>
          </div>
          <div className="px-6 py-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
