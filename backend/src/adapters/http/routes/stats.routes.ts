import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { GetStats } from "../../../application/usecases/GetStats.js";
import { PrismaStatsRepository } from "../../../infrastructure/database/repositories/PrismaStatsRepository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export async function statsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Stats"],
      summary: "Get workout statistics for a date range",
      querystring: z.object({
        from: z.iso.date(),
        to: z.iso.date(),
      }),
      response: {
        200: z.object({
          workoutStreak: z.number(),
          consistencyByDay: z.record(
            z.string(),
            z.object({
              workoutDayCompleted: z.boolean(),
              workoutDayStarted: z.boolean(),
            }),
          ),
          completedWorkoutsCount: z.number(),
          conclusionRate: z.number(),
          totalTimeInSeconds: z.number(),
        }),
        401: z.object({
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

        const statsRepository = new PrismaStatsRepository();
        const getStats = new GetStats(statsRepository);

        const result = await getStats.execute({
          userId: session.user.id,
          from: request.query.from,
          to: request.query.to,
        });

        return reply.status(200).send(result);
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
}
