import express, { request } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./Config/config.service.js";
import { corsOptions } from "./Utils/cors/cors.js";
import { Ratelimiter } from "./Utils/Ratelimitter/ratelimitter.js";
import { BadRequestException, GlobalHandler, } from "./Utils/responses/error.response.js";
import { AuthRouter } from "./modules/index.js";
import ConnectDB from "./DB/Connection.js";
import { UserModel } from "./DB/models/User.model.js";
import { GenerateHash } from "./Utils/Hashing/hash.js";
export const bootstrap = async () => {
    const app = express();
    app.use(express.json(), cors(corsOptions), helmet(), Ratelimiter);
    await ConnectDB();
    app.get("/", (req, res) => {
        return res.status(200).json({ message: "hello" });
    });
    app.use("/auth", AuthRouter);
    app.use(GlobalHandler);
    app.listen(env.PORT, () => {
        console.log(`app is running on port ${env.PORT} in ${env.MODE} mode`);
    });
};
