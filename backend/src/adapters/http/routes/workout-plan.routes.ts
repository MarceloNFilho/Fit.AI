import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { CreateWorkoutPlan } from "../../../application/usecases/CreateWorkoutPlan.js";
import { GetWorkoutDay } from "../../../application/usecases/GetWorkoutDay.js";
import { GetWorkoutPlan } from "../../../application/usecases/GetWorkoutPlan.js";
import { GetWorkoutPlans } from "../../../application/usecases/GetWorkoutPlans.js";
import { StartWorkoutSession } from "../../../application/usecases/StartWorkoutSession.js";
import { UpdateWorkoutSession } from "../../../application/usecases/UpdateWorkoutSession.js";
import { WeekDay } from "../../../domain/enums/WeekDay.js";
import { PrismaWorkoutPlanRepository } from "../../../infrastructure/database/repositories/PrismaWorkoutPlanRepository.js";
import { PrismaWorkoutSessionRepository } from "../../../infrastructure/database/repositories/PrismaWorkoutSessionRepository.js";
import {
  ForbiddenError,
  NotFoundError,
  WorkoutPlanNotActiveError,
  WorkoutSessionAlreadyStartedError,
} from "../../../shared/errors/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export async function workoutPlanRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/workout-plans",
    schema: {
      tags: ["Workout Plan"],
      summary: "Create a workout plan",
      body: z.object({
        name: z.string().trim().min(1),
        workoutDays: z.array(
          z.object({
            name: z.string().trim().min(1),
            weekDay: z.enum(WeekDay),
            isRestDay: z.boolean().default(false),
            estimatedDurationInSeconds: z.number().min(1),
            coverImageUrl: z.string().url().nullish(),
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

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/workout-plans",
    schema: {
      tags: ["Workout Plan"],
      summary: "List workout plans",
      querystring: z.object({
        active: z
          .enum(["true", "false"])
          .transform((v) => v === "true")
          .optional(),
      }),
      response: {
        200: z.object({
          workoutPlans: z.array(
            z.object({
              id: z.uuid(),
              name: z.string(),
              isActive: z.boolean(),
              workoutDays: z.array(
                z.object({
                  id: z.uuid(),
                  name: z.string(),
                  weekDay: z.enum(WeekDay),
                  isRestDay: z.boolean(),
                  coverImageUrl: z.string().url().nullable(),
                  estimatedDurationInSeconds: z.number(),
                  exercises: z.array(
                    z.object({
                      id: z.uuid(),
                      name: z.string(),
                      order: z.number(),
                      sets: z.number(),
                      reps: z.number(),
                      restTimeInSeconds: z.number(),
                      workoutDayId: z.uuid(),
                    }),
                  ),
                }),
              ),
            }),
          ),
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

        const workoutPlanRepository = new PrismaWorkoutPlanRepository();
        const getWorkoutPlans = new GetWorkoutPlans(workoutPlanRepository);

        const result = await getWorkoutPlans.execute({
          userId: session.user.id,
          active: request.query.active,
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

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/workout-plans/:workoutPlanId/days/:workoutDayId/sessions",
    schema: {
      tags: ["Workout Plan"],
      summary: "Start a workout session",
      params: z.object({
        workoutPlanId: z.uuid(),
        workoutDayId: z.uuid(),
      }),
      response: {
        201: z.object({
          workoutSessionId: z.uuid(),
        }),
        401: z.object({
          message: z.string(),
          code: z.string(),
        }),
        403: z.object({
          message: z.string(),
          code: z.string(),
        }),
        404: z.object({
          message: z.string(),
          code: z.string(),
        }),
        409: z.object({
          message: z.string(),
          code: z.string(),
        }),
        422: z.object({
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
        const workoutSessionRepository = new PrismaWorkoutSessionRepository();
        const startWorkoutSession = new StartWorkoutSession(
          workoutPlanRepository,
          workoutSessionRepository,
        );

        const result = await startWorkoutSession.execute({
          userId: session.user.id,
          workoutPlanId: request.params.workoutPlanId,
          workoutDayId: request.params.workoutDayId,
        });

        return reply.status(201).send(result);
      } catch (error) {
        app.log.error(error);
        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "NOT_FOUND",
          });
        }
        if (error instanceof ForbiddenError) {
          return reply.status(403).send({
            message: error.message,
            code: "FORBIDDEN",
          });
        }
        if (error instanceof WorkoutPlanNotActiveError) {
          return reply.status(422).send({
            message: error.message,
            code: "WORKOUT_PLAN_NOT_ACTIVE",
          });
        }
        if (error instanceof WorkoutSessionAlreadyStartedError) {
          return reply.status(409).send({
            message: error.message,
            code: "WORKOUT_SESSION_ALREADY_STARTED",
          });
        }
        return reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/workout-plans/:workoutPlanId/days/:workoutDayId/sessions/:sessionId",
    schema: {
      tags: ["Workout Plan"],
      summary: "Update a workout session",
      params: z.object({
        workoutPlanId: z.uuid(),
        workoutDayId: z.uuid(),
        sessionId: z.uuid(),
      }),
      body: z.object({
        completedAt: z.iso.datetime(),
      }),
      response: {
        200: z.object({
          id: z.uuid(),
          startedAt: z.iso.datetime(),
          completedAt: z.iso.datetime(),
        }),
        401: z.object({
          message: z.string(),
          code: z.string(),
        }),
        403: z.object({
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
        const workoutSessionRepository = new PrismaWorkoutSessionRepository();
        const updateWorkoutSession = new UpdateWorkoutSession(
          workoutPlanRepository,
          workoutSessionRepository,
        );

        const result = await updateWorkoutSession.execute({
          userId: session.user.id,
          workoutPlanId: request.params.workoutPlanId,
          workoutDayId: request.params.workoutDayId,
          sessionId: request.params.sessionId,
          completedAt: request.body.completedAt,
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
        if (error instanceof ForbiddenError) {
          return reply.status(403).send({
            message: error.message,
            code: "FORBIDDEN",
          });
        }
        return reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/workout-plans/:id",
    schema: {
      tags: ["Workout Plan"],
      summary: "Get a workout plan by ID",
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          id: z.uuid(),
          name: z.string(),
          workoutDays: z.array(
            z.object({
              id: z.uuid(),
              name: z.string(),
              weekDay: z.enum(WeekDay),
              isRestDay: z.boolean(),
              coverImageUrl: z.string().url().nullable(),
              estimatedDurationInSeconds: z.number(),
              exercisesCount: z.number(),
            }),
          ),
        }),
        401: z.object({
          message: z.string(),
          code: z.string(),
        }),
        403: z.object({
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
        const getWorkoutPlan = new GetWorkoutPlan(workoutPlanRepository);

        const result = await getWorkoutPlan.execute({
          userId: session.user.id,
          workoutPlanId: request.params.id,
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
        if (error instanceof ForbiddenError) {
          return reply.status(403).send({
            message: error.message,
            code: "FORBIDDEN",
          });
        }
        return reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/workout-plans/:planId/days/:dayId",
    schema: {
      tags: ["Workout Plan"],
      summary: "Get a workout day with exercises and sessions",
      params: z.object({
        planId: z.uuid(),
        dayId: z.uuid(),
      }),
      response: {
        200: z.object({
          id: z.uuid(),
          name: z.string(),
          weekDay: z.enum(WeekDay),
          isRestDay: z.boolean(),
          coverImageUrl: z.string().url().nullable(),
          estimatedDurationInSeconds: z.number(),
          exercises: z.array(
            z.object({
              id: z.uuid(),
              name: z.string(),
              order: z.number(),
              sets: z.number(),
              reps: z.number(),
              restTimeInSeconds: z.number(),
              workoutDayId: z.uuid(),
            }),
          ),
          sessions: z.array(
            z.object({
              id: z.uuid(),
              workoutDayId: z.uuid(),
              startedAt: z.iso.datetime(),
              completedAt: z.iso.datetime().nullable(),
            }),
          ),
        }),
        401: z.object({
          message: z.string(),
          code: z.string(),
        }),
        403: z.object({
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
        const getWorkoutDay = new GetWorkoutDay(workoutPlanRepository);

        const result = await getWorkoutDay.execute({
          userId: session.user.id,
          workoutPlanId: request.params.planId,
          workoutDayId: request.params.dayId,
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
        if (error instanceof ForbiddenError) {
          return reply.status(403).send({
            message: error.message,
            code: "FORBIDDEN",
          });
        }
        return reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
}
