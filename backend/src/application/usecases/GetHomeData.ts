import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { WeekDay } from "../../domain/enums/WeekDay.js";
import type { HomeRepository } from "../../domain/ports/repositories/HomeRepository.js";
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
  date: string;
}

interface TodayWorkoutDayDto {
  workoutPlanId: string;
  id: string;
  name: string;
  isRest: boolean;
  weekDay: string;
  estimatedDurationInSeconds: number;
  coverImageUrl?: string;
  exercisesCount: number;
}

interface ConsistencyEntry {
  workoutDayCompleted: boolean;
  workoutDayStarted: boolean;
}

interface OutputDto {
  activeWorkoutPlanId: string | null;
  todayWorkoutDay: TodayWorkoutDayDto | null;
  workoutStreak: number;
  consistencyByDay: Record<string, ConsistencyEntry>;
}

export class GetHomeData {
  constructor(private readonly homeRepository: HomeRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const workoutPlan = await this.homeRepository.findActiveWorkoutPlan(
      dto.userId,
    );

    const date = dayjs.utc(dto.date);
    const weekStart = date.startOf("week").startOf("day");
    const weekEnd = date.endOf("week").endOf("day");

    const weeklySessions = await this.homeRepository.findSessionsInWeek(
      dto.userId,
      weekStart.toDate(),
      weekEnd.toDate(),
    );

    const consistencyByDay: Record<string, ConsistencyEntry> = {};

    for (let i = 0; i < 7; i++) {
      const day = weekStart.add(i, "day");
      const key = day.format("YYYY-MM-DD");
      consistencyByDay[key] = {
        workoutDayCompleted: false,
        workoutDayStarted: false,
      };
    }

    weeklySessions.forEach((session) => {
      const key = dayjs.utc(session.startedAt).format("YYYY-MM-DD");
      if (!consistencyByDay[key]) return;

      consistencyByDay[key].workoutDayStarted = true;
      if (session.completedAt) {
        consistencyByDay[key].workoutDayCompleted = true;
      }
    });

    if (!workoutPlan) {
      return {
        activeWorkoutPlanId: null,
        todayWorkoutDay: null,
        workoutStreak: 0,
        consistencyByDay,
      };
    }

    const todayWeekDay = WEEKDAY_MAP[date.day()];
    const todayDay = workoutPlan.workoutDays.find(
      (d) => d.weekDay === todayWeekDay,
    );

    const todayWorkoutDay: TodayWorkoutDayDto | null = todayDay
      ? {
          workoutPlanId: workoutPlan.id,
          id: todayDay.id,
          name: todayDay.name,
          isRest: todayDay.isRestDay,
          weekDay: todayDay.weekDay,
          estimatedDurationInSeconds: todayDay.estimatedDurationInSeconds,
          coverImageUrl: todayDay.coverImageUrl ?? undefined,
          exercisesCount: todayDay.exercises.length,
        }
      : null;

    const allCompletedSessions =
      await this.homeRepository.findAllCompletedSessions(dto.userId);

    const completedDateSet = new Set(
      allCompletedSessions.map((s) =>
        dayjs.utc(s.completedAt!).format("YYYY-MM-DD"),
      ),
    );

    const workoutDayWeekdays = new Set(
      workoutPlan.workoutDays.map((d) => d.weekDay),
    );

    let workoutStreak = 0;
    let current = date;

    while (true) {
      const currentWeekDay = WEEKDAY_MAP[current.day()];
      const hasWorkoutDay = workoutDayWeekdays.has(currentWeekDay);

      if (!hasWorkoutDay) {
        current = current.subtract(1, "day");

        if (date.diff(current, "day") > 365) break;
        continue;
      }

      const key = current.format("YYYY-MM-DD");
      if (!completedDateSet.has(key)) break;

      workoutStreak++;
      current = current.subtract(1, "day");
    }

    return {
      activeWorkoutPlanId: workoutPlan.id,
      todayWorkoutDay,
      workoutStreak,
      consistencyByDay,
    };
  }
}
