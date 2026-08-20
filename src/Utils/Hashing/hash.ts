import bcrypt from "bcrypt";
import { env } from "../../Config/config.service.js";

export const GenerateHash = async (
  plaintext: string,
  SaltRounds: number = Number(env.SALT_ROUNDS),
): Promise<String> => {
  return await bcrypt.hash(plaintext, SaltRounds);
};

export const VerifyHash = async (
  plaintext: string,
  ciphertext: string,
): Promise<Boolean> => {
  return await bcrypt.compare(plaintext, ciphertext);
};
