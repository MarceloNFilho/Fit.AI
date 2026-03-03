import { WeekDay } from "../enums/WeekDay.js";
import type { WorkoutExercise } from "./WorkoutExercise.js";

export interface WorkoutDay {
  id: string;
  name: string;
  weekDay: WeekDay;
  isRestDay: boolean;
  estimatedDurationInSeconds: number;
  coverImageUrl: string | null;
  workoutPlanId: string;
  exercises: WorkoutExercise[];
  createdAt: Date;
  updatedAt: Date;
}
