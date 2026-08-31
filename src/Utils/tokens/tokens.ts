import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { HUserDocument } from "../../DB/models/User.model.js";
import { RoleEnum, TokenTypeEnum } from "../enums/user.enums.js";
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

export const verifyToken = ({
  Token,
  SecretKey,
}: {
  Token: any;
  SecretKey: any;
}) => {
  return jwt.verify(Token, SecretKey);
};

export const getSignature = ({
  TokenType,
  Role,
}: {
  TokenType: TokenTypeEnum;
  Role: RoleEnum;
}) => {
  const isAdmin = Role === RoleEnum.ADMIN;
  const AdminSignature =
    TokenType === TokenTypeEnum.ACCESS
      ? env.ACCESS_TOKEN_ADMIN_KEY
      : env.REFRESH_TOKEN_ADMIN_KEY;
  const UserSignature =
    TokenType === TokenTypeEnum.ACCESS
      ? env.ACCESS_TOKEN_USER_KEY
      : env.REFRESH_TOKEN_USER_KEY;
  if (isAdmin) {
    return { AdminSignature: AdminSignature };
  }
  return { UserSignature: UserSignature };
};

export const getCredintials = (
  user: HUserDocument,
): { accessToken: string; refreshToken: string } => {
  const accessSignature = getSignature({
    TokenType: TokenTypeEnum.ACCESS,
    Role: user.role === RoleEnum.ADMIN ? RoleEnum.ADMIN : RoleEnum.USER,
  });
  const RefreshSignature = getSignature({
    TokenType: TokenTypeEnum.REFRESH,
    Role: user.role === RoleEnum.ADMIN ? RoleEnum.ADMIN : RoleEnum.USER,
  });
  const accessToken = GenerateToken({
    payload: { _id: user._id },
    secretkey: String(
      user.role === RoleEnum.ADMIN
        ? accessSignature.AdminSignature
        : accessSignature.UserSignature,
    ),
    options: {
      expiresIn: accessSignature.AdminSignature
        ? Number(env.ACCESS_TOKEN_ADMIN_EXPIRE_IN)
        : Number(env.ACCESS_TOKEN_USER_EXPIRE_IN),
    },
  });
  const refreshToken = GenerateToken({
    payload: { _id: user._id },
    secretkey: String(
      user.role === RoleEnum.ADMIN
        ? RefreshSignature.AdminSignature
        : RefreshSignature.UserSignature,
    ),
    options: {
      expiresIn: RefreshSignature.AdminSignature
        ? Number(env.REFRESH_TOKEN_ADMIN_EXPIRE_IN)
        : Number(env.REFRESH_TOKEN_USER_EXPIRE_IN),
    },
  });
  return { accessToken, refreshToken };
};
