import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { checkOnboarding } from "@/app/_lib/check-onboarding";
import Image from "next/image";
import Link from "next/link";
import { Goal } from "lucide-react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { RestDayCard } from "./_components/rest-day-card";

const WEEKDAY_ORDER: Record<string, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    return redirect("/auth");
  }

  await checkOnboarding();

  const response = await getWorkoutPlan(planId);

  if (response.status !== 200) {
    return redirect("/");
  }

  const workoutPlan = response.data;
  const sortedDays = [...workoutPlan.workoutDays].sort(
    (a, b) => (WEEKDAY_ORDER[a.weekDay] ?? 0) - (WEEKDAY_ORDER[b.weekDay] ?? 0),
  );

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background pb-24 md:ml-60 md:pb-8">
      <div className="relative flex h-[296px] w-full flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5 md:rounded-none">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            alt=""
            src="/workout-plan-banner.png"
            fill
            className="object-cover rounded-b-[20px]"
            priority
          />
          <div
            className="absolute inset-0 rounded-b-[20px]"
            style={{
              backgroundImage:
                "linear-gradient(238deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </div>

        <p className="relative text-[22px] font-normal uppercase leading-[1.15] text-background font-anton">
          Fit.ai
        </p>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex w-fit items-center gap-1 rounded-full bg-background px-2.5 py-1.5">
              <Goal className="size-4 text-babg-background-foreground" />
              <span className="text-xs font-semibold uppercase leading-none text-babg-background-foreground font-inter-tight">
                {workoutPlan.name}
              </span>
            </div>
            <p className="text-2xl font-semibold leading-[1.05] text-background font-inter-tight">
              Plano de Treino
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 p-5 md:grid md:grid-cols-2 lg:grid-cols-3">
        {sortedDays.map((day) =>
          day.isRestDay ? (
            <RestDayCard key={day.id} weekDay={day.weekDay} />
          ) : (
            <Link
              key={day.id}
              href={`/workout-plans/${planId}/days/${day.id}`}
              className="w-full"
            >
              <WorkoutDayCard
                name={day.name}
                weekDay={day.weekDay}
                estimatedDurationInSeconds={day.estimatedDurationInSeconds}
                exercisesCount={day.exercisesCount}
                coverImageUrl={day.coverImageUrl}
              />
            </Link>
          ),
        )}
      </div>

      <BottomNav activePage="calendar" />
    </div>
  );
}
