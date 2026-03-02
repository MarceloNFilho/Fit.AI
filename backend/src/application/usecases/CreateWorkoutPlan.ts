import { WeekDay } from "../../domain/enums/WeekDay.js";
import type { WorkoutPlanRepository } from "../../domain/ports/repositories/WorkoutPlanRepository.js";
import { NotFoundError } from "../../shared/errors/index.js";

interface CreateWorkoutPlanInput {
  userId: string;
  name: string;
  workoutDays: {
    name: string;
    weekDay: WeekDay;
    isRestDay: boolean;
    estimatedDurationInSeconds: number;
    exercises: {
      order: number;
      name: string;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
    }[];
  }[];
}

interface CreateWorkoutPlanOutput {
  id: string;
}

export class CreateWorkoutPlan {
  constructor(private readonly workoutPlanRepository: WorkoutPlanRepository) {}

  async execute(
    input: CreateWorkoutPlanInput,
  ): Promise<CreateWorkoutPlanOutput> {
    const existingPlan = await this.workoutPlanRepository.findActiveByUserId(
      input.userId,
    );

    if (existingPlan) {
      await this.workoutPlanRepository.deactivate(existingPlan.id);
    }

    const workoutPlan = await this.workoutPlanRepository.create({
      name: input.name,
      userId: input.userId,
      workoutDays: input.workoutDays,
    });

    const result = await this.workoutPlanRepository.findByIdWithDetails(
      workoutPlan.id,
    );

    if (!result) {
      throw new NotFoundError("Workout plan not found");
    }

    return { id: result.id };
  }
}
