import { rateLimit, type RateLimitRequestHandler } from "express-rate-limit";

export const Ratelimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 30000,
  limit: 15,
  message: {
    status: 429,
    message: "too many requests try later",
  },
  legacyHeaders: false,
  standardHeaders: true,
});
