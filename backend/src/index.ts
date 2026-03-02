import "dotenv/config";

import { createServer } from "./adapters/http/server.js";

const app = await createServer();

try {
  await app.listen({ port: Number(process.env.PORT) });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
