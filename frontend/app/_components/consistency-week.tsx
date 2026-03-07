import Image from "next/image";
import dayjs from "dayjs";
import type { GetHome200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const WEEKDAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"] as const;

interface ConsistencyWeekProps {
  consistencyByDay: GetHome200ConsistencyByDay;
  workoutStreak: number;
}

export function ConsistencyWeek({
  consistencyByDay,
  workoutStreak,
}: ConsistencyWeekProps) {
  const today = dayjs();
  const startOfWeek = today.startOf("week").add(1, "day");

  const days = WEEKDAY_LABELS.map((label, index) => {
    const date = startOfWeek.add(index, "day");
    const dateKey = date.format("YYYY-MM-DD");
    return { label, dateKey, isToday: date.isSame(today, "day") };
  });

  return (
    <div className="flex gap-3 items-stretch w-full">
      <div className="flex items-center justify-between rounded-xl border border-border p-5 flex-1">
        {days.map((day) => {
          const status = consistencyByDay[day.dateKey];
          const isCompleted = status?.workoutDayCompleted ?? false;
          const isStarted = status?.workoutDayStarted ?? false;

          let squareClassName = "size-5 rounded-md border border-border";

          if (isCompleted) {
            squareClassName = "size-5 rounded-md bg-chart-2";
          } else if (isStarted) {
            squareClassName = "size-5 rounded-md bg-chart-2/25";
          } else if (day.isToday) {
            squareClassName = "size-5 rounded-md border-[1.6px] border-chart-2";
          }

          return (
            <div
              key={day.dateKey}
              className="flex flex-col gap-1.5 items-center"
            >
              <div className={squareClassName} />
              <span className="text-xs leading-[1.4] text-muted-foreground font-inter-tight">
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-streak-bg px-5">
        <Image src="/fire-icon.svg" alt="Streak" width={15} height={20} />
        <span className="text-base font-semibold leading-[1.15] text-streak-text font-inter-tight">
          {workoutStreak}
        </span>
      </div>
    </div>
  );
}
