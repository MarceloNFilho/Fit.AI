import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function healthRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/swagger.json",
    schema: {
      hide: true,
    },
    handler: async () => {
      return app.swagger();
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      description: "Hello world",
      tags: ["hello"],
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
    handler: () => {
      return {
        message: "Hello World",
      };
    },
  });
}
