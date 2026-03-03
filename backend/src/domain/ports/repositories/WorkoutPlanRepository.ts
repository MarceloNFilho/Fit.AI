import type { WorkoutPlan } from "../../entities/WorkoutPlan.js";
import type { WeekDay } from "../../enums/WeekDay.js";

export interface CreateWorkoutPlanInput {
  name: string;
  userId: string;
  workoutDays: {
    name: string;
    weekDay: WeekDay;
    isRestDay: boolean;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string | null;
    exercises: {
      name: string;
      order: number;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
    }[];
  }[];
}

export interface WorkoutDayWithCount {
  id: string;
  name: string;
  weekDay: WeekDay;
  isRestDay: boolean;
  coverImageUrl: string | null;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
}

export interface WorkoutPlanWithCount {
  id: string;
  name: string;
  userId: string;
  workoutDays: WorkoutDayWithCount[];
}

export interface WorkoutExerciseOutput {
  id: string;
  name: string;
  order: number;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
  workoutDayId: string;
}

export interface WorkoutSessionOutput {
  id: string;
  workoutDayId: string;
  startedAt: string;
  completedAt: string | null;
}

export interface WorkoutDayWithDetails {
  id: string;
  name: string;
  weekDay: WeekDay;
  isRestDay: boolean;
  coverImageUrl: string | null;
  estimatedDurationInSeconds: number;
  workoutPlanId: string;
  exercises: WorkoutExerciseOutput[];
  sessions: WorkoutSessionOutput[];
}

export interface WorkoutDayFull {
  id: string;
  name: string;
  weekDay: WeekDay;
  isRestDay: boolean;
  coverImageUrl: string | null;
  estimatedDurationInSeconds: number;
  exercises: WorkoutExerciseOutput[];
}

export interface WorkoutPlanWithDetails {
  id: string;
  name: string;
  isActive: boolean;
  workoutDays: WorkoutDayFull[];
}

export interface WorkoutPlanRepository {
  findActiveByUserId(userId: string): Promise<WorkoutPlan | null>;
  deactivate(id: string): Promise<void>;
  create(input: CreateWorkoutPlanInput): Promise<WorkoutPlan>;
  findByIdWithDetails(id: string): Promise<WorkoutPlan | null>;
  findById(id: string): Promise<WorkoutPlanWithCount | null>;
  findDayById(
    planId: string,
    dayId: string,
  ): Promise<WorkoutDayWithDetails | null>;
  findManyByUserId(
    userId: string,
    filters?: { active?: boolean },
  ): Promise<WorkoutPlanWithDetails[]>;
}
