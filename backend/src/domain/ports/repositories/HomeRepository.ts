import type { WorkoutPlan } from "../../entities/WorkoutPlan.js";
import type { WorkoutSession } from "../../entities/WorkoutSession.js";

export interface HomeRepository {
  findActiveWorkoutPlan(userId: string): Promise<WorkoutPlan | null>;
  findSessionsInWeek(
    userId: string,
    weekStart: Date,
    weekEnd: Date,
  ): Promise<WorkoutSession[]>;
  findAllCompletedSessions(userId: string): Promise<WorkoutSession[]>;
}
