import bcrypt from "bcrypt";
import { env } from "../../Config/config.service.js";
export const GenerateHash = async (plaintext, SaltRounds = Number(env.SALT_ROUNDS)) => {
    return await bcrypt.hash(plaintext, SaltRounds);
};
export const VerifyHash = async (plaintext, ciphertext) => {
    return await bcrypt.compare(plaintext, ciphertext);
};
