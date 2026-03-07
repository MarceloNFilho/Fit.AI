import Image from "next/image";
import { Calendar, Timer, Dumbbell } from "lucide-react";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h${remainingMinutes}min`
      : `${hours}h`;
  }
  return `${minutes}min`;
}

interface WorkoutDayCardProps {
  name: string;
  weekDay: string;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
  coverImageUrl?: string | null;
}

export function WorkoutDayCard({
  name,
  weekDay,
  estimatedDurationInSeconds,
  exercisesCount,
  coverImageUrl,
}: WorkoutDayCardProps) {
  return (
    <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
      {coverImageUrl && (
        <Image
          alt=""
          src={coverImageUrl}
          fill
          className="pointer-events-none object-cover"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

      <div className="relative flex items-center justify-center">
        <div className="flex items-center justify-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm">
          <Calendar className="size-3.5 text-background" />
          <span className="text-xs font-semibold uppercase leading-none text-background font-inter-tight">
            {WEEKDAY_LABELS[weekDay] ?? weekDay}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-2 items-start">
        <p className="text-2xl font-semibold leading-[1.05] text-background font-inter-tight">
          {name}
        </p>
        <div className="flex gap-2 items-start">
          <div className="flex items-center justify-center gap-1">
            <Timer className="size-3.5 text-background/70" />
            <span className="text-xs leading-[1.4] text-background/70 font-inter-tight">
              {formatDuration(estimatedDurationInSeconds)}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Dumbbell className="size-3.5 text-background/70" />
            <span className="text-xs leading-[1.4] text-background/70 font-inter-tight">
              {exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
