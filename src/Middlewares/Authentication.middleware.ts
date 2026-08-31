import {
  RoleEnum,
  TokenTypeEnum,
  type TokenPayload,
} from "../Utils/enums/user.enums.js";
import { getSignature, verifyToken } from "../Utils/tokens/tokens.js";
import { UserModel } from "../DB/models/User.model.js";
import type { Jwt, JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

export const decodeToken = async ({
  Authorization,
  TokenType,
}: {
  Authorization: any;
  TokenType: TokenTypeEnum;
}) => {
  const [Bearer, token] = Authorization.split(" ") || [];

  const signature = getSignature({
    TokenType:
      TokenType === TokenTypeEnum.ACCESS
        ? TokenTypeEnum.ACCESS
        : TokenTypeEnum.REFRESH,
    Role: Bearer === RoleEnum.ADMIN ? RoleEnum.ADMIN : RoleEnum.USER,
  });

  const decoded: any = verifyToken({
    Token: token,
    SecretKey:
      Bearer === RoleEnum.ADMIN
        ? signature.AdminSignature
        : signature.UserSignature,
  });

  const user = await UserModel.findOne({ _id: decoded._id });

  return { user, decoded };
};

export const Authentication = ({ TokenType }: { TokenType: TokenTypeEnum }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user, decoded } = await decodeToken({
      Authorization: req.headers.authorization,
      TokenType,
    });

    req.user = user!;
    req.decoded = decoded;
    next();
  };
};
