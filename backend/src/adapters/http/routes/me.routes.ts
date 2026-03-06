import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { GetUserTrainData } from "../../../application/usecases/GetUserTrainData.js";
import { PrismaUserRepository } from "../../../infrastructure/database/repositories/PrismaUserRepository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const meRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/me",
    schema: {
      operationId: "getMe",
      tags: ["Me"],
      summary: "Get the authenticated user's train data",
      response: {
        200: z
          .object({
            userId: z.string(),
            userName: z.string(),
            weightInGrams: z.number(),
            heightInCentimeters: z.number(),
            age: z.number(),
            bodyFatPercentage: z.number().int().min(0).max(100),
          })
          .nullable(),
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

        const userRepository = new PrismaUserRepository();
        const getUserTrainData = new GetUserTrainData(userRepository);

        const result = await getUserTrainData.execute({
          userId: session.user.id,
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
};
