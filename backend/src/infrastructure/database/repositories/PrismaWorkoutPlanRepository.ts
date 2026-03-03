import dayjs from "dayjs";

import type { WorkoutPlan } from "../../../domain/entities/WorkoutPlan.js";
import type { WeekDay } from "../../../domain/enums/WeekDay.js";
import type {
  CreateWorkoutPlanInput,
  WorkoutDayWithDetails,
  WorkoutPlanRepository,
  WorkoutPlanWithCount,
} from "../../../domain/ports/repositories/WorkoutPlanRepository.js";
import { prisma } from "../prisma.js";

export class PrismaWorkoutPlanRepository implements WorkoutPlanRepository {
  async findActiveByUserId(userId: string): Promise<WorkoutPlan | null> {
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

  async deactivate(id: string): Promise<void> {
    await prisma.workoutPlan.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async create(input: CreateWorkoutPlanInput): Promise<WorkoutPlan> {
    const plan = await prisma.workoutPlan.create({
      data: {
        name: input.name,
        userId: input.userId,
        workoutDays: {
          create: input.workoutDays.map((day) => ({
            name: day.name,
            weekDay: day.weekDay,
            isRestDay: day.isRestDay,
            estimatedDurationInSeconds: day.estimatedDurationInSeconds,
            coverImageUrl: day.coverImageUrl,
            exercises: {
              create: day.exercises.map((exercise) => ({
                name: exercise.name,
                order: exercise.order,
                sets: exercise.sets,
                reps: exercise.reps,
                restTimeInSeconds: exercise.restTimeInSeconds,
              })),
            },
          })),
        },
      },
      include: {
        workoutDays: {
          include: {
            exercises: true,
          },
        },
      },
    });

    return plan as WorkoutPlan;
  }

  async findByIdWithDetails(id: string): Promise<WorkoutPlan | null> {
    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
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

  async findById(id: string): Promise<WorkoutPlanWithCount | null> {
    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
      include: {
        workoutDays: {
          include: {
            _count: { select: { exercises: true } },
          },
        },
      },
    });

    if (!plan) return null;

    return {
      id: plan.id,
      name: plan.name,
      userId: plan.userId,
      workoutDays: plan.workoutDays.map((day) => ({
        id: day.id,
        name: day.name,
        weekDay: day.weekDay as WeekDay,
        isRestDay: day.isRestDay,
        coverImageUrl: day.coverImageUrl ?? null,
        estimatedDurationInSeconds: day.estimatedDurationInSeconds,
        exercisesCount: day._count.exercises,
      })),
    };
  }

  async findDayById(
    planId: string,
    dayId: string,
  ): Promise<WorkoutDayWithDetails | null> {
    const day = await prisma.workoutDay.findFirst({
      where: { id: dayId, workoutPlanId: planId },
      include: {
        exercises: true,
        workoutSessions: true,
      },
    });

    if (!day) return null;

    return {
      id: day.id,
      name: day.name,
      weekDay: day.weekDay as WeekDay,
      isRestDay: day.isRestDay,
      coverImageUrl: day.coverImageUrl ?? null,
      estimatedDurationInSeconds: day.estimatedDurationInSeconds,
      workoutPlanId: day.workoutPlanId,
      exercises: day.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        order: exercise.order,
        sets: exercise.sets,
        reps: exercise.reps,
        restTimeInSeconds: exercise.restTimeInSeconds,
        workoutDayId: exercise.workoutDayId,
      })),
      sessions: day.workoutSessions.map((session) => ({
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
