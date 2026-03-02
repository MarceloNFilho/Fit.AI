import { fromNodeHeaders } from "better-auth/node";
import type { FastifyReply, FastifyRequest } from "fastify";

import { auth } from "../../../infrastructure/auth/better-auth.js";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    reply.status(401).send({
      message: "Unauthorized",
      code: "UNAUTHORIZED",
    });
    return null;
  }

  return session;
}
