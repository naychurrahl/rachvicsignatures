import { ArrowLeft, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StaffOwnerHeaderProps {
  title: string;
  onBack: () => void;
  icon?: LucideIcon;
  backLabel?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function StaffOwnerHeader({
  title,
  onBack,
  icon: Icon = ArrowLeft,
  backLabel = "Back",
  action,
  children,
}: StaffOwnerHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
      <div className="flex items-center justify-between mb-3 last:mb-0">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 -ml-2 active:scale-90 transition-transform"
            aria-label={backLabel}
          >
            <Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg ml-2">{title}</h1>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
