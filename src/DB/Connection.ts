import mongoose from "mongoose";
import { env } from "../Config/config.service.js";

export const ConnectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("mongodb is connected");
  } catch (error) {
    console.log(`mongodb error:${error}`);
    throw error;
  }
};
export default ConnectDB;
