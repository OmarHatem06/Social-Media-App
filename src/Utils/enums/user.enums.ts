import type { JwtPayload } from "jsonwebtoken";

export enum GenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum RoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum TokenTypeEnum {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

export interface TokenPayload extends JwtPayload {
  _id: string;
  iat: number;
  exp: number;
}
