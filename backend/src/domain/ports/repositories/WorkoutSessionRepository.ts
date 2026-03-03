import type { WorkoutSession } from "../../entities/WorkoutSession.js";

export interface UpdateWorkoutSessionInput {
  completedAt: Date;
}

export interface WorkoutSessionRepository {
  findActiveByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null>;
  findById(id: string): Promise<WorkoutSession | null>;
  create(workoutDayId: string, startedAt: Date): Promise<WorkoutSession>;
  update(id: string, input: UpdateWorkoutSessionInput): Promise<WorkoutSession>;
}
