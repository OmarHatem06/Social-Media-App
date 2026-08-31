import { resolve } from "path";
import dotenv, { config } from "dotenv";
config({ path: resolve("./Config/dev.env") });

export const env = {
  PORT: process.env.PORT || 3220,
  MODE: process.env.MODE,
  APPLICATION_NAME: process.env.APPLICATION_NAME,
  MONGO_URI: process.env.MONGO_URI as string,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY,
  ACCESS_TOKEN_ADMIN_KEY: process.env.ACCESS_TOKEN_ADMIN_KEY,
  ACCESS_TOKEN_ADMIN_EXPIRE_IN: process.env.ACCESS_TOKEN_ADMIN_EXPIRE_IN,
  REFRESH_TOKEN_ADMIN_KEY: process.env.REFRESH_TOKEN_ADMIN_KEY,
  REFRESH_TOKEN_ADMIN_EXPIRE_IN: process.env.REFRESH_TOKEN_ADMIN_EXPIRE_IN,
  ACCESS_TOKEN_USER_KEY: process.env.ACCESS_TOKEN_USER_KEY,
  ACCESS_TOKEN_USER_EXPIRE_IN: process.env.ACCESS_TOKEN_USER_EXPIRE_IN,
  REFRESH_TOKEN_USER_KEY: process.env.REFRESH_TOKEN_USER_KEY,
  REFRESH_TOKEN_USER_EXPIRE_IN: process.env.REFRESH_TOKEN_USER_EXPIRE_IN,
  REDIS_URI: process.env.REDIS_URI,
  WHITELIST: process.env.WHITELIST?.split(",") || [],
  USEREMAIL: process.env.USEREMAIL,
  EMAILPASS: process.env.EMAILPASS,
  CLOUDE_NAME: process.env.CLOUDE_NAME as string,
  API_KEY: process.env.API_KEY as string,
  API_SECRET: process.env.API_SECRET as string,
};
export type Env = typeof env;
