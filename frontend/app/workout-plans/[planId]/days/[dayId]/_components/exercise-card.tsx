import { Zap } from "lucide-react";
import { ExerciseHelpButton } from "@/app/_components/chatbot/exercise-help-button";

interface ExerciseCardProps {
  name: string;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
}

export function ExerciseCard({
  name,
  sets,
  reps,
  restTimeInSeconds,
}: ExerciseCardProps) {
  return (
    <div className="flex w-full items-start justify-between rounded-xl border border-border p-4">
      <div className="flex flex-1 flex-col gap-3 justify-center">
        <div className="flex w-full items-center justify-between">
          <p className="text-base font-semibold leading-[1.4] text-foreground font-inter-tight">
            {name}
          </p>
          <ExerciseHelpButton exerciseName={name} />
        </div>
        <div className="flex gap-1.5 items-start">
          <div className="flex items-center justify-center rounded-full bg-muted px-2.5 py-1.5">
            <span className="text-xs font-semibold uppercase leading-none text-muted-foreground font-inter-tight">
              {sets} séries
            </span>
          </div>
          <div className="flex items-center justify-center rounded-full bg-muted px-2.5 py-1.5">
            <span className="text-xs font-semibold uppercase leading-none text-muted-foreground font-inter-tight">
              {reps} reps
            </span>
          </div>
          <div className="flex h-[22px] items-center justify-center gap-1 rounded-full bg-muted px-2.5 py-1.5">
            <Zap className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase leading-none text-muted-foreground font-inter-tight">
              {restTimeInSeconds}S
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
