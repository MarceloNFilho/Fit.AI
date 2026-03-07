import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStats } from "@/app/_lib/api/fetch-generated";
import { checkOnboarding } from "@/app/_lib/check-onboarding";
import dayjs from "dayjs";
import { CircleCheck, CirclePercent, Hourglass } from "lucide-react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { StreakBanner } from "./_components/streak-banner";
import { ConsistencyHeatmap } from "./_components/consistency-heatmap";
import { StatCard } from "./_components/stat-card";

function formatTotalTime(totalTimeInSeconds: number): string {
  const totalMinutes = Math.floor(totalTimeInSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h${minutes.toString().padStart(2, "0")}m`;
}

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    return redirect("/auth");
  }

  await checkOnboarding();

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.endOf("day").format("YYYY-MM-DD");

  const statsResponse = await getStats({ from, to });

  if (statsResponse.status !== 200) {
    return redirect("/auth");
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = statsResponse.data;

  console.log(statsResponse.data);

  return (
    <div className="flex min-h-screen flex-col items-center bg-background pb-24">
      <div className="flex h-14 w-full items-center px-5">
        <p className="text-[22px] font-normal uppercase leading-[1.15] text-foreground font-anton">
          Fit.ai
        </p>
      </div>

      <div className="flex w-full flex-col px-5">
        <StreakBanner workoutStreak={workoutStreak} />
      </div>

      <div className="flex w-full flex-col gap-3 p-5">
        <p className="text-lg font-semibold leading-[1.4] text-foreground font-inter-tight">
          Consistência
        </p>

        <ConsistencyHeatmap consistencyByDay={consistencyByDay} />

        <div className="flex gap-3">
          <StatCard
            icon={CircleCheck}
            value={String(completedWorkoutsCount)}
            label="Treinos Feitos"
          />
          <StatCard
            icon={CirclePercent}
            value={`${Math.round(conclusionRate * 100)}%`}
            label="Taxa de conclusão"
          />
        </div>

        <StatCard
          icon={Hourglass}
          value={formatTotalTime(totalTimeInSeconds)}
          label="Tempo Total"
        />
      </div>

      <BottomNav activePage="stats" />
    </div>
  );
}
