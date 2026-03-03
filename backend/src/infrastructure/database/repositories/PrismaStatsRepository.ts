import type { WeekDay } from "../../../domain/enums/WeekDay.js";
import type {
  StatsRepository,
  StatsSession,
  StatsWorkoutPlan,
} from "../../../domain/ports/repositories/StatsRepository.js";
import { prisma } from "../prisma.js";

export class PrismaStatsRepository implements StatsRepository {
  async findSessionsInRange(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<StatsSession[]> {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        startedAt: { gte: from, lte: to },
        workoutDay: { workoutPlan: { userId } },
      },
      orderBy: { startedAt: "asc" },
    });

    return sessions as StatsSession[];
  }

  async findActiveWorkoutPlan(
    userId: string,
  ): Promise<StatsWorkoutPlan | null> {
    const plan = await prisma.workoutPlan.findFirst({
      where: { userId, isActive: true },
      select: {
        workoutDays: {
          select: { weekDay: true },
        },
      },
    });

    if (!plan) return null;

    return {
      workoutDays: plan.workoutDays.map((d) => ({
        weekDay: d.weekDay as WeekDay,
      })),
    };
  }

  async findAllCompletedSessions(userId: string): Promise<StatsSession[]> {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        completedAt: { not: null },
        workoutDay: { workoutPlan: { userId } },
      },
      orderBy: { completedAt: "desc" },
    });

    return sessions as StatsSession[];
  }
}
