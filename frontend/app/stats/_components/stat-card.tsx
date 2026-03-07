import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col items-center gap-5 rounded-xl border p-5">
      <div className="flex items-center rounded-full bg-primary/10 p-[9px]">
        <Icon className="size-4 text-primary" />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-2xl font-semibold leading-[1.15] text-foreground font-inter-tight">
          {value}
        </p>
        <p className="text-xs leading-[1.4] text-muted-foreground font-inter-tight">
          {label}
        </p>
      </div>
    </div>
  );
}
