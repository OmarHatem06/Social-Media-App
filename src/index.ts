import { bootstrap } from "./app.controller.js";

bootstrap().catch((error: unknown) => {
  console.log("failed to start the app", error);
  process.exit(1);
});
