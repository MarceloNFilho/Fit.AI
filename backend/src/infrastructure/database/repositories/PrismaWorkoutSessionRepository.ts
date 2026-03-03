import type { WorkoutSession } from "../../../domain/entities/WorkoutSession.js";
import type { WorkoutSessionRepository } from "../../../domain/ports/repositories/WorkoutSessionRepository.js";
import { prisma } from "../prisma.js";

export class PrismaWorkoutSessionRepository implements WorkoutSessionRepository {
  async findActiveByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null> {
    const session = await prisma.workoutSession.findFirst({
      where: { workoutDayId, completedAt: null },
    });

    return session as WorkoutSession | null;
  }

  async create(workoutDayId: string, startedAt: Date): Promise<WorkoutSession> {
    const session = await prisma.workoutSession.create({
      data: {
        workoutDayId,
        startedAt,
      },
    });

    return session as WorkoutSession;
  }
}
