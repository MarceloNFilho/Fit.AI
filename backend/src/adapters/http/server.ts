import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { aiRoutes } from "./routes/ai.js";
import { authRoutes } from "./routes/auth.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { homeRoutes } from "./routes/home.routes.js";
import { meRoutes } from "./routes/me.routes.js";
import { statsRoutes } from "./routes/stats.routes.js";
import { workoutPlanRoutes } from "./routes/workout-plan.routes.js";

export async function createServer() {
  const app = Fastify({
    logger: true,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Fit.AI API",
        description: "API do Fit.AI",
        version: "1.0.0",
      },
      servers: [
        {
          description: "localhost",
          url: `http://localhost:${process.env.PORT}`,
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifyCors, {
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  await app.register(fastifyApiReference, {
    routePrefix: "/docs",
    configuration: {
      sources: [
        {
          title: "Fit.AI API",
          slug: "fit-ai-api",
          url: "/swagger.json",
        },
        {
          title: "Auth API",
          slug: "auth-api",
          url: "/api/auth/open-api/generate-schema",
        },
      ],
    },
  });

  // Register route modules
  await app.register(workoutPlanRoutes);
  await app.register(homeRoutes);
  await app.register(meRoutes);
  await app.register(authRoutes);
  await app.register(healthRoutes);
  await app.register(statsRoutes, { prefix: "/stats" });
  await app.register(aiRoutes);

  return app;
}
