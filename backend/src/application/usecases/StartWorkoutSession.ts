import dayjs from "dayjs";

import type { WorkoutPlanRepository } from "../../domain/ports/repositories/WorkoutPlanRepository.js";
import type { WorkoutSessionRepository } from "../../domain/ports/repositories/WorkoutSessionRepository.js";
import {
  ForbiddenError,
  NotFoundError,
  WorkoutPlanNotActiveError,
  WorkoutSessionAlreadyStartedError,
} from "../../shared/errors/index.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
}

interface OutputDto {
  workoutSessionId: string;
}

export class StartWorkoutSession {
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

    if (!workoutPlan.isActive) {
      throw new WorkoutPlanNotActiveError("Workout plan is not active");
    }

    const workoutDay = workoutPlan.workoutDays.find(
      (day) => day.id === dto.workoutDayId,
    );

    if (!workoutDay) {
      throw new NotFoundError("Workout day not found");
    }

    const existingSession =
      await this.workoutSessionRepository.findActiveByWorkoutDayId(
        dto.workoutDayId,
      );

    if (existingSession) {
      throw new WorkoutSessionAlreadyStartedError(
        "This workout day already has an active session",
      );
    }

    const session = await this.workoutSessionRepository.create(
      dto.workoutDayId,
      dayjs().toDate(),
    );

    return { workoutSessionId: session.id };
  }
}
