import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { CreateWorkoutPlan } from "../../../application/usecases/CreateWorkoutPlan.js";
import { WeekDay } from "../../../domain/enums/WeekDay.js";
import { PrismaWorkoutPlanRepository } from "../../../infrastructure/database/repositories/PrismaWorkoutPlanRepository.js";
import { NotFoundError } from "../../../shared/errors/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export async function workoutPlanRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/workout-plans",
    schema: {
      body: z.object({
        name: z.string().trim().min(1),
        workoutDays: z.array(
          z.object({
            name: z.string().trim().min(1),
            weekDay: z.enum(WeekDay),
            isRestDay: z.boolean().default(false),
            estimatedDurationInSeconds: z.number().min(1),
            exercises: z.array(
              z.object({
                name: z.string().trim().min(1),
                order: z.number().min(0),
                sets: z.number().min(1),
                reps: z.number().min(1),
                restTimeInSeconds: z.number().min(1),
              }),
            ),
          }),
        ),
      }),
      response: {
        201: z.object({
          id: z.uuid(),
        }),
        400: z.object({
          message: z.string(),
          code: z.string(),
        }),
        401: z.object({
          message: z.string(),
          code: z.string(),
        }),
        404: z.object({
          message: z.string(),
          code: z.string(),
        }),
        500: z.object({
          message: z.string(),
          code: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const session = await authMiddleware(request, reply);
        if (!session) return;

        const workoutPlanRepository = new PrismaWorkoutPlanRepository();
        const createWorkoutPlan = new CreateWorkoutPlan(workoutPlanRepository);

        const result = await createWorkoutPlan.execute({
          userId: session.user.id,
          name: request.body.name,
          workoutDays: request.body.workoutDays.map((day) => ({
            ...day,
            weekDay: day.weekDay as WeekDay,
          })),
        });

        return reply.status(201).send(result);
      } catch (error) {
        app.log.error(error);
        if (error instanceof NotFoundError) {
          reply.status(404).send({
            message: error.message,
            code: "NOT_FOUND",
          });
          return;
        }
        reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
}
