import { env } from "../Config/config.service.js";
const whitelist = env.WHITELIST;
export const corsOptions = {
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
