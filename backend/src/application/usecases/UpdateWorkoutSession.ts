import dayjs from "dayjs";

import type { WorkoutPlanRepository } from "../../domain/ports/repositories/WorkoutPlanRepository.js";
import type { WorkoutSessionRepository } from "../../domain/ports/repositories/WorkoutSessionRepository.js";
import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
  completedAt: string;
}

interface OutputDto {
  id: string;
  startedAt: string;
  completedAt: string;
}

export class UpdateWorkoutSession {
  constructor(
    private readonly workoutPlanRepository: WorkoutPlanRepository,
    private readonly workoutSessionRepository: WorkoutSessionRepository,
  ) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const workoutPlan = await this.workoutPlanRepository.findByIdWithDetails(
      dto.workoutPlanId,
    );

    if (!workoutPlan) {
      throw new NotFoundError("Workout plan not found");
    }

    if (workoutPlan.userId !== dto.userId) {
      throw new ForbiddenError(
        "You are not allowed to access this workout plan",
      );
    }

    const workoutDay = workoutPlan.workoutDays.find(
      (day) => day.id === dto.workoutDayId,
    );

    if (!workoutDay) {
      throw new NotFoundError("Workout day not found");
    }

    const session = await this.workoutSessionRepository.findById(dto.sessionId);

    if (!session || session.workoutDayId !== dto.workoutDayId) {
      throw new NotFoundError("Workout session not found");
    }

    const updated = await this.workoutSessionRepository.update(dto.sessionId, {
      completedAt: dayjs(dto.completedAt).toDate(),
    });

    return {
      id: updated.id,
      startedAt: dayjs(updated.startedAt).toISOString(),
      completedAt: dayjs(updated.completedAt!).toISOString(),
    };
  }
}
