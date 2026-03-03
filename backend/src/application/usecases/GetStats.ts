import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { WeekDay } from "../../domain/enums/WeekDay.js";
import type { StatsRepository } from "../../domain/ports/repositories/StatsRepository.js";

dayjs.extend(utc);

const WEEKDAY_MAP: Record<number, WeekDay> = {
  0: WeekDay.SUNDAY,
  1: WeekDay.MONDAY,
  2: WeekDay.TUESDAY,
  3: WeekDay.WEDNESDAY,
  4: WeekDay.THURSDAY,
  5: WeekDay.FRIDAY,
  6: WeekDay.SATURDAY,
};

interface InputDto {
  userId: string;
  from: string;
  to: string;
}

interface ConsistencyEntry {
  workoutDayCompleted: boolean;
  workoutDayStarted: boolean;
}

interface OutputDto {
  workoutStreak: number;
  consistencyByDay: Record<string, ConsistencyEntry>;
  completedWorkoutsCount: number;
  conclusionRate: number;
  totalTimeInSeconds: number;
}

export class GetStats {
  constructor(private readonly statsRepository: StatsRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const from = dayjs.utc(dto.from).startOf("day").toDate();
    const to = dayjs.utc(dto.to).endOf("day").toDate();

    const sessions = await this.statsRepository.findSessionsInRange(
      dto.userId,
      from,
      to,
    );

    const consistencyByDay: Record<string, ConsistencyEntry> = {};

    sessions.forEach((session) => {
      const key = dayjs.utc(session.startedAt).format("YYYY-MM-DD");

      if (!consistencyByDay[key]) {
        consistencyByDay[key] = {
          workoutDayStarted: true,
          workoutDayCompleted: false,
        };
      } else {
        consistencyByDay[key].workoutDayStarted = true;
      }

      if (session.completedAt) {
        consistencyByDay[key].workoutDayCompleted = true;
      }
    });

    const completedWorkoutsCount = sessions.filter(
      (s) => s.completedAt !== null,
    ).length;

    const conclusionRate =
      sessions.length === 0 ? 0 : completedWorkoutsCount / sessions.length;

    const totalTimeInSeconds = sessions
      .filter((s) => s.completedAt !== null)
      .reduce(
        (acc, s) =>
          acc + dayjs(s.completedAt!).diff(dayjs(s.startedAt), "second"),
        0,
      );

    const workoutPlan = await this.statsRepository.findActiveWorkoutPlan(
      dto.userId,
    );

    let workoutStreak = 0;

    if (workoutPlan) {
      const allCompletedSessions =
        await this.statsRepository.findAllCompletedSessions(dto.userId);

      const completedDateSet = new Set(
        allCompletedSessions.map((s) =>
          dayjs.utc(s.completedAt!).format("YYYY-MM-DD"),
        ),
      );

      const workoutDayWeekdays = new Set(
        workoutPlan.workoutDays.map((d) => d.weekDay),
      );

      let current = dayjs.utc(dto.to);

      while (true) {
        const currentWeekDay = WEEKDAY_MAP[current.day()];
        const hasWorkoutDay = workoutDayWeekdays.has(currentWeekDay);

        if (!hasWorkoutDay) {
          current = current.subtract(1, "day");
          if (dayjs.utc(dto.to).diff(current, "day") > 365) break;
          continue;
        }

        const key = current.format("YYYY-MM-DD");
        if (!completedDateSet.has(key)) break;

        workoutStreak++;
        current = current.subtract(1, "day");
      }
    }

    return {
      workoutStreak,
      consistencyByDay,
      completedWorkoutsCount,
      conclusionRate,
      totalTimeInSeconds,
    };
  }
}
