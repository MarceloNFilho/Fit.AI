import dayjs from "dayjs";

import type { WeekDay } from "../../domain/enums/WeekDay.js";
import type { WorkoutPlanRepository } from "../../domain/ports/repositories/WorkoutPlanRepository.js";
import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";

interface InputDto {
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
}

interface ExerciseOutputDto {
  id: string;
  name: string;
  order: number;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
  workoutDayId: string;
}

interface SessionOutputDto {
  id: string;
  workoutDayId: string;
  startedAt: string;
  completedAt: string | null;
}

interface OutputDto {
  id: string;
  name: string;
  weekDay: WeekDay;
  isRestDay: boolean;
  coverImageUrl: string | null;
  estimatedDurationInSeconds: number;
  exercises: ExerciseOutputDto[];
  sessions: SessionOutputDto[];
}

export class GetWorkoutDay {
  constructor(private readonly workoutPlanRepository: WorkoutPlanRepository) {}

  async execute(dto: InputDto): Promise<OutputDto> {
    const day = await this.workoutPlanRepository.findDayById(
      dto.workoutPlanId,
      dto.workoutDayId,
    );

    if (!day) {
      throw new NotFoundError("Workout day not found");
    }

    const plan = await this.workoutPlanRepository.findById(dto.workoutPlanId);

    if (!plan || plan.userId !== dto.userId) {
      throw new ForbiddenError(
        "You do not have permission to access this workout day",
      );
    }

    return {
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
      sessions: day.sessions.map((session) => ({
        id: session.id,
        workoutDayId: session.workoutDayId,
        startedAt: dayjs(session.startedAt).toISOString(),
        completedAt: session.completedAt
          ? dayjs(session.completedAt).toISOString()
          : null,
      })),
    };
  }
}
