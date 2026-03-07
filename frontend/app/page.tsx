import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkOnboarding } from "./_lib/check-onboarding";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "./_components/bottom-nav";
import { ConsistencyWeek } from "./_components/consistency-week";
import { WorkoutDayCard } from "./_components/workout-day-card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { RestDayCard } from "./workout-plans/[planId]/_components/rest-day-card";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    return redirect("/auth");
  }

  const { homeResponse } = await checkOnboarding();

  if (homeResponse.status !== 200) {
    return redirect("/auth");
  }

  const { todayWorkoutDay, workoutStreak, consistencyByDay } =
    homeResponse.data;
  const userName = session.data.user.name?.split(" ")[0] ?? "";

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background pb-24">
      <div className="relative flex h-[296px] w-full flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            alt=""
            src="/home-banner.jpg"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(243deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
            }}
          />
        </div>

        <p className="relative text-[22px] font-normal uppercase leading-[1.15] text-background font-anton">
          Fit.ai
        </p>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex gap-1.5">
            <div className="relative size-[52px] shrink-0 overflow-hidden rounded-full">
              {session.data.user.image ? (
                <Image
                  src={session.data.user.image}
                  alt={userName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                  <User className="size-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-2xl font-semibold leading-[1.05] text-background font-inter-tight">
                Olá, {userName}
              </p>
              <p className="text-sm leading-[1.15] text-background/70 font-inter-tight">
                Bora treinar hoje?
              </p>
            </div>
          </div>
          {todayWorkoutDay && !todayWorkoutDay.isRest && (
            <Button
              asChild
              variant="secondary"
              className="rounded-full px-4 py-2 text-sm font-semibold font-inter-tight"
            >
              <Link
                href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
              >
                Bora!
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 items-start px-5 pt-5">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold leading-[1.4] text-foreground font-inter-tight">
            Consistência
          </p>
          <Link href="/stats" className="text-xs leading-[1.4] text-primary font-inter-tight">
            Ver histórico
          </Link>
        </div>
        <ConsistencyWeek
          consistencyByDay={consistencyByDay}
          workoutStreak={workoutStreak}
        />
      </div>

      <div className="flex w-full flex-col gap-3 items-start p-5">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold leading-[1.4] text-foreground font-inter-tight">
            Treino de Hoje
          </p>
          {todayWorkoutDay && (
            <Link
              href={`/workout-plans/${todayWorkoutDay.workoutPlanId}`}
              className="text-xs leading-[1.4] text-primary font-inter-tight"
            >
              Ver treinos
            </Link>
          )}
        </div>
        {todayWorkoutDay && !todayWorkoutDay.isRest ? (
          <Link
            href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
            className="w-full"
          >
            <WorkoutDayCard
              name={todayWorkoutDay.name}
              weekDay={todayWorkoutDay.weekDay}
              estimatedDurationInSeconds={
                todayWorkoutDay.estimatedDurationInSeconds
              }
              exercisesCount={todayWorkoutDay.exercisesCount}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
            />
          </Link>
        ) : (
          <RestDayCard weekDay={todayWorkoutDay?.weekDay ?? ""} />
        )}
      </div>

      <BottomNav activePage="home" />
    </div>
  );
}
