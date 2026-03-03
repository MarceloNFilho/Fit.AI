import type { WorkoutSession } from "../../entities/WorkoutSession.js";

export interface WorkoutSessionRepository {
  findActiveByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null>;
  create(workoutDayId: string, startedAt: Date): Promise<WorkoutSession>;
}
