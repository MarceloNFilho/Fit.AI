import dayjs from "dayjs";
import type { GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

interface Week {
  days: { date: dayjs.Dayjs; dateKey: string }[];
  monthIndex: number;
}

interface MonthSpan {
  label: string;
  colStart: number;
  colSpan: number;
}

function buildHeatmapData(monthsBack: number) {
  const today = dayjs();
  const startMonth = today.subtract(monthsBack, "month").startOf("month");
  const endMonth = today.endOf("month");

  let current = startMonth;
  while (current.day() !== 1) {
    current = current.subtract(1, "day");
  }

  const allWeeks: Week[] = [];

  while (current.isBefore(endMonth) || current.isSame(endMonth, "day")) {
    const days: { date: dayjs.Dayjs; dateKey: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const day = current.add(i, "day");
      days.push({ date: day, dateKey: day.format("YYYY-MM-DD") });
    }

    const thursday = days[3];
    if (
      !thursday.date.isBefore(startMonth) &&
      !thursday.date.isAfter(endMonth)
    ) {
      allWeeks.push({ days, monthIndex: thursday.date.month() });
    }

    current = current.add(7, "day");
  }

  const monthSpans: MonthSpan[] = [];
  let currentMonth: MonthSpan | null = null;

  allWeeks.forEach((week, index) => {
    if (!currentMonth || currentMonth.label !== MONTH_LABELS[week.monthIndex]) {
      currentMonth = {
        label: MONTH_LABELS[week.monthIndex],
        colStart: index + 1,
        colSpan: 1,
      };
      monthSpans.push(currentMonth);
    } else {
      currentMonth.colSpan++;
    }
  });

  return { allWeeks, monthSpans, totalColumns: allWeeks.length };
}

interface ConsistencyHeatmapProps {
  consistencyByDay: GetStats200ConsistencyByDay;
  monthsBack?: number;
}

export function ConsistencyHeatmap({
  consistencyByDay,
  monthsBack = 2,
}: ConsistencyHeatmapProps) {
  const { allWeeks, monthSpans, totalColumns } = buildHeatmapData(monthsBack);

  return (
    <div className="w-full rounded-xl border border-border p-4">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
          gridTemplateRows: "auto repeat(7, 1fr)",
        }}
      >
        {monthSpans.map((month) => (
          <p
            key={month.label}
            className="pb-1 text-xs leading-[1.4] text-muted-foreground font-inter-tight"
            style={{
              gridRow: 1,
              gridColumn: `${month.colStart} / span ${month.colSpan}`,
            }}
          >
            {month.label}
          </p>
        ))}

        {allWeeks.map((week, weekIndex) =>
          week.days.map((day, dayIndex) => {
            const status = consistencyByDay[day.dateKey];
            const isCompleted = status?.workoutDayCompleted ?? false;
            const isStarted = status?.workoutDayStarted ?? false;

            let className = "aspect-square rounded-md border border-border";

            if (isCompleted) {
              className = "aspect-square rounded-md bg-chart-2";
            } else if (isStarted) {
              className = "aspect-square rounded-md bg-chart-2/25";
            }

            return (
              <div
                key={day.dateKey}
                className={className}
                style={{
                  gridColumn: weekIndex + 1,
                  gridRow: dayIndex + 2,
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
