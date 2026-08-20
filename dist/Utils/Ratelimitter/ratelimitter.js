import { rateLimit } from "express-rate-limit";
export const Ratelimiter = rateLimit({
    windowMs: 30000,
    limit: 15,
    message: {
        status: 429,
        message: "too many requests try later",
    },
    legacyHeaders: false,
    standardHeaders: true,
});
