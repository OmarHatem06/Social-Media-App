import type { CorsOptions } from "cors";
import { env } from "../../Config/config.service.js";

const whitelist: string[] = env.WHITELIST;

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("not allowed by cors"));
  },
};
