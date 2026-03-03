import type { WeekDay } from "../../domain/enums/WeekDay.js";
import type { WorkoutPlanRepository } from "../../domain/ports/repositories/WorkoutPlanRepository.js";
import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
}

interface WorkoutDayOutputDto {
  id: string;
  name: string;
  weekDay: WeekDay;
  isRestDay: boolean;
  coverImageUrl: string | null;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
}

interface OutputDto {
  id: string;
  name: string;
  workoutDays: WorkoutDayOutputDto[];
}

export class GetWorkoutPlan {
  constructor(private readonly workoutPlanRepository: WorkoutPlanRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const plan = await this.workoutPlanRepository.findById(dto.workoutPlanId);

    if (!plan) {
      throw new NotFoundError("Workout plan not found");
    }

    if (plan.userId !== dto.userId) {
      throw new ForbiddenError(
        "You do not have permission to access this workout plan",
      );
    }

    return {
      id: plan.id,
      name: plan.name,
      workoutDays: plan.workoutDays.map((day) => ({
        id: day.id,
        name: day.name,
        weekDay: day.weekDay,
        isRestDay: day.isRestDay,
        coverImageUrl: day.coverImageUrl,
        estimatedDurationInSeconds: day.estimatedDurationInSeconds,
        exercisesCount: day.exercisesCount,
      })),
    };
  }
}
