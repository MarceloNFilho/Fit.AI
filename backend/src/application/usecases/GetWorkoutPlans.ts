import type { WeekDay } from "../../domain/enums/WeekDay.js";
import type { WorkoutPlanRepository } from "../../domain/ports/repositories/WorkoutPlanRepository.js";

interface InputDto {
  userId: string;
  active?: boolean;
}

interface WorkoutExerciseDto {
  id: string;
  name: string;
  order: number;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
  workoutDayId: string;
}

interface WorkoutDayDto {
  id: string;
  name: string;
  weekDay: WeekDay;
  isRestDay: boolean;
  coverImageUrl: string | null;
  estimatedDurationInSeconds: number;
  exercises: WorkoutExerciseDto[];
}

interface WorkoutPlanDto {
  id: string;
  name: string;
  isActive: boolean;
  workoutDays: WorkoutDayDto[];
}

interface OutputDto {
  workoutPlans: WorkoutPlanDto[];
}

export class GetWorkoutPlans {
  constructor(private readonly workoutPlanRepository: WorkoutPlanRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const plans = await this.workoutPlanRepository.findManyByUserId(
      dto.userId,
      { active: dto.active },
    );

    return {
      workoutPlans: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        isActive: plan.isActive,
        workoutDays: plan.workoutDays.map((day) => ({
          id: day.id,
          name: day.name,
          weekDay: day.weekDay,
          isRestDay: day.isRestDay,
          coverImageUrl: day.coverImageUrl,
          estimatedDurationInSeconds: day.estimatedDurationInSeconds,
          exercises: day.exercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            order: exercise.order,
            sets: exercise.sets,
            reps: exercise.reps,
            restTimeInSeconds: exercise.restTimeInSeconds,
            workoutDayId: exercise.workoutDayId,
          })),
        })),
      })),
    };
  }
}
