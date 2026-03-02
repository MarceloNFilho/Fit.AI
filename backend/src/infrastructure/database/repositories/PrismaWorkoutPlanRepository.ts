import type { WorkoutPlan } from "../../../domain/entities/WorkoutPlan.js";
import type {
  CreateWorkoutPlanInput,
  WorkoutPlanRepository,
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
}
