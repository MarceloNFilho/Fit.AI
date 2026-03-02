import type { WorkoutPlan } from "../../entities/WorkoutPlan.js";
import { WeekDay } from "../../enums/WeekDay.js";

export interface CreateWorkoutPlanInput {
  name: string;
  userId: string;
  workoutDays: {
    name: string;
    weekDay: WeekDay;
    isRestDay: boolean;
    estimatedDurationInSeconds: number;
    exercises: {
      name: string;
      order: number;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
    }[];
  }[];
}

export interface WorkoutPlanRepository {
  findActiveByUserId(userId: string): Promise<WorkoutPlan | null>;
  deactivate(id: string): Promise<void>;
  create(input: CreateWorkoutPlanInput): Promise<WorkoutPlan>;
  findByIdWithDetails(id: string): Promise<WorkoutPlan | null>;
}
