import { Grid3x3, ChevronRight } from "lucide-react";

interface SectionToggleButtonProps {
  expanded: boolean;
  onClick: () => void;
}

export function SectionToggleButton({ expanded, onClick }: SectionToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity shrink-0"
    >
      {expanded ? (
        <>
          Show Less
          <Grid3x3 className="h-4 w-4" />
        </>
      ) : (
        <>
          See All
          <ChevronRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
