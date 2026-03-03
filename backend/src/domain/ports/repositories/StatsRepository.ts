import type { WeekDay } from "../../enums/WeekDay.js";

export interface StatsSession {
  id: string;
  workoutDayId: string;
  startedAt: Date;
  completedAt: Date | null;
}

export interface StatsWorkoutDay {
  weekDay: WeekDay;
}

export interface StatsWorkoutPlan {
  workoutDays: StatsWorkoutDay[];
}

export interface StatsRepository {
  findSessionsInRange(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<StatsSession[]>;
  findActiveWorkoutPlan(userId: string): Promise<StatsWorkoutPlan | null>;
  findAllCompletedSessions(userId: string): Promise<StatsSession[]>;
}
