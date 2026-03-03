import type { WorkoutPlan } from "../../../domain/entities/WorkoutPlan.js";
import type { WorkoutSession } from "../../../domain/entities/WorkoutSession.js";
import type { HomeRepository } from "../../../domain/ports/repositories/HomeRepository.js";
import { prisma } from "../prisma.js";

export class PrismaHomeRepository implements HomeRepository {
  async findActiveWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
    const plan = await prisma.workoutPlan.findFirst({
      where: { userId, isActive: true },
      include: {
        workoutDays: {
          include: {
            exercises: true,
          },
        },
      },
    });

    return plan as WorkoutPlan | null;
  }

  async findSessionsInWeek(
    userId: string,
    weekStart: Date,
    weekEnd: Date,
  ): Promise<WorkoutSession[]> {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        startedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
        workoutDay: {
          workoutPlan: {
            userId,
          },
        },
      },
    });

    return sessions as WorkoutSession[];
  }

  async findAllCompletedSessions(userId: string): Promise<WorkoutSession[]> {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        completedAt: { not: null },
        workoutDay: {
          workoutPlan: {
            userId,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    return sessions as WorkoutSession[];
  }
}
