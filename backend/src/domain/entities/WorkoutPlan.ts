import type { WorkoutDay } from "./WorkoutDay.js";

export interface WorkoutPlan {
  id: string;
  name: string;
  userId: string;
  isActive: boolean;
  workoutDays: WorkoutDay[];
  createdAt: Date;
  updatedAt: Date;
}
