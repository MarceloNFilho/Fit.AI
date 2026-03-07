import "dotenv/config";

import { createServer } from "./adapters/http/server.js";
import { env } from "./infrastructure/env.js";

const app = await createServer();

try {
  await app.listen({ port: Number(env.PORT) });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
