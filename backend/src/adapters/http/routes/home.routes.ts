import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { GetHomeData } from "../../../application/usecases/GetHomeData.js";
import { PrismaHomeRepository } from "../../../infrastructure/database/repositories/PrismaHomeRepository.js";
import { NotFoundError } from "../../../shared/errors/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const homeRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/home/:date",
    schema: {
      operationId: "getHome",
      tags: ["Home"],
      summary: "Get home screen data for the authenticated user",
      params: z.object({
        date: z.iso.date(),
      }),
      response: {
        200: z.object({
          activeWorkoutPlanId: z.uuid().nullable(),
          todayWorkoutDay: z
            .object({
              workoutPlanId: z.uuid(),
              id: z.uuid(),
              name: z.string(),
              isRest: z.boolean(),
              weekDay: z.string(),
              estimatedDurationInSeconds: z.number(),
              coverImageUrl: z.string().url().optional(),
              exercisesCount: z.number(),
            })
            .nullable(),
          workoutStreak: z.number(),
          consistencyByDay: z.record(
            z.string(),
            z.object({
              workoutDayCompleted: z.boolean(),
              workoutDayStarted: z.boolean(),
            }),
          ),
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

        const homeRepository = new PrismaHomeRepository();
        const getHomeData = new GetHomeData(homeRepository);

        const result = await getHomeData.execute({
          userId: session.user.id,
          date: request.params.date,
        });

        return reply.status(200).send(result);
      } catch (error) {
        app.log.error(error);
        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "NOT_FOUND",
          });
        }
        return reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
