import { Calendar, Zap } from "lucide-react";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

interface RestDayCardProps {
  weekDay: string;
}

export function RestDayCard({ weekDay }: RestDayCardProps) {
  return (
    <div className="flex h-[110px] w-full flex-col items-start justify-between rounded-xl bg-secondary p-5">
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-1 rounded-full bg-foreground/8 px-2.5 py-1.5 backdrop-blur-sm">
          <Calendar className="size-3.5 text-foreground" />
          <span className="text-xs font-semibold uppercase leading-none text-foreground font-inter-tight">
            {WEEKDAY_LABELS[weekDay] ?? weekDay}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Zap className="size-5 text-foreground" />
        <p className="text-2xl font-semibold leading-[1.05] text-foreground font-inter-tight">
          Descanso
        </p>
      </div>
    </div>
  );
}
