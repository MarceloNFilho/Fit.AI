import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkoutDay } from "@/app/_lib/api/fetch-generated";
import { checkOnboarding } from "@/app/_lib/check-onboarding";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, Timer, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/app/_components/bottom-nav";
import { ExerciseCard } from "./_components/exercise-card";
import { StartWorkoutButton } from "./_components/start-workout-button";
import { CompleteWorkoutButton } from "./_components/complete-workout-button";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
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

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ planId: string; dayId: string }>;
}) {
  const { planId, dayId } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    return redirect("/auth");
  }

  await checkOnboarding();

  const response = await getWorkoutDay(planId, dayId);

  if (response.status !== 200) {
    return redirect("/");
  }

  const workoutDay = response.data;
  const hasCompletedSession = workoutDay.sessions.some(
    (s) => s.completedAt !== null,
  );
  const inProgressSession = workoutDay.sessions.find(
    (s) => s.completedAt === null,
  );
  const hasInProgressSession = !!inProgressSession;


  const weekDayLabel =
    WEEKDAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay;
  const weekDayLabelUpper = weekDayLabel.toUpperCase();

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background pb-24 md:ml-60 md:pb-8">
      <div className="flex w-full flex-col gap-5 p-5">
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="size-6 text-foreground" />
            </Link>
          </Button>
          <p className="text-lg font-semibold leading-[1.4] text-foreground font-inter-tight">
            {weekDayLabel}
          </p>
          <div className="size-6" />
        </div>

        <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
          {workoutDay.coverImageUrl && (
            <Image
              alt=""
              src={workoutDay.coverImageUrl}
              fill
              className="pointer-events-none object-cover"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

          <div className="relative flex items-center justify-center">
            <div className="flex items-center justify-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm">
              <Calendar className="size-3.5 text-background" />
              <span className="text-xs font-semibold uppercase leading-none text-background font-inter-tight">
                {weekDayLabelUpper}
              </span>
            </div>
          </div>

          <div className="relative flex w-full items-end justify-between">
            <div className="flex flex-col gap-2 items-start">
              <p className="text-2xl font-semibold leading-[1.05] text-background font-inter-tight">
                {workoutDay.name}
              </p>
              <div className="flex gap-2 items-start">
                <div className="flex items-center justify-center gap-1">
                  <Timer className="size-3.5 text-background/70" />
                  <span className="text-xs leading-[1.4] text-background/70 font-inter-tight">
                    {formatDuration(workoutDay.estimatedDurationInSeconds)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Dumbbell className="size-3.5 text-background/70" />
                  <span className="text-xs leading-[1.4] text-background/70 font-inter-tight">
                    {workoutDay.exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>

            {!hasInProgressSession && !hasCompletedSession && (
              <StartWorkoutButton planId={planId} dayId={dayId} />
            )}
            {hasCompletedSession && (
              <Button
                variant="ghost"
                className="rounded-full px-4 py-2 text-sm font-semibold text-background font-inter-tight"
                disabled
              >
                Concluído!
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:grid md:grid-cols-2">
          {workoutDay.exercises
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                name={exercise.name}
                sets={exercise.sets}
                reps={exercise.reps}
                restTimeInSeconds={exercise.restTimeInSeconds}
              />
            ))}
        </div>

        {hasInProgressSession && !hasCompletedSession && inProgressSession && (
          <CompleteWorkoutButton
            planId={planId}
            dayId={dayId}
            sessionId={inProgressSession.id}
          />
        )}
      </div>

      <BottomNav activePage="calendar" />
    </div>
  );
}
