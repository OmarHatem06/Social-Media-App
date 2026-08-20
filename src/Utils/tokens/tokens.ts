import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { HUserDocument } from "../../DB/models/User.model.js";
import { RoleEnum } from "../enums/user.enums.js";
import { env } from "../../Config/config.service.js";

export const GenerateToken = ({
  payload,
  secretkey,
  options,
}: {
  payload: object;
  secretkey: Secret;
  options: SignOptions;
}) => {
  return jwt.sign(payload, secretkey, options);
};

export const getCredintials = (
  user: HUserDocument,
): { accessToken: string; refreshToken: string } => {
  const isAdmin = user.role === RoleEnum.ADMIN;
  const accessSignature = isAdmin
    ? env.ACCESS_TOKEN_ADMIN_KEY!
    : env.ACCESS_TOKEN_USER_KEY!;
  const refreshSignatur = isAdmin
    ? env.REFRESH_TOKEN_ADMIN_KEY!
    : env.REFRESH_TOKEN_USER_KEY!;
  const accessToken = GenerateToken({
    payload: { _id: user._id },
    secretkey: accessSignature,
    options: {
      expiresIn: isAdmin
        ? Number(env.ACCESS_TOKEN_ADMIN_EXPIRE_IN)
        : Number(env.ACCESS_TOKEN_USER_EXPIRE_IN),
    },
  });
  const refreshToken = GenerateToken({
    payload: { _id: user._id },
    secretkey: refreshSignatur,
    options: {
      expiresIn: isAdmin
        ? Number(env.REFRESH_TOKEN_ADMIN_EXPIRE_IN)
        : Number(env.REFRESH_TOKEN_USER_EXPIRE_IN),
    },
  });
  return { accessToken, refreshToken };
};
