import type { Request, NextFunction, Response } from "express";
import type { ZodType } from "zod";
import { BadRequestException } from "../Utils/responses/error.response.js";

type KeyReqType = keyof Request;
type SchemaType = Partial<Record<KeyReqType, ZodType>>;

export const Validation = (Schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ValidationErrors: Array<{
      key: KeyReqType;
      issues: Array<{ message: string; path: (string | number | symbol)[] }>;
    }> = [];
    for (const key of Object.keys(Schema) as KeyReqType[]) {
      const keySchema = Schema[key];
      if (!keySchema) continue; //the value of the key is undefined skip it
      const validationResult = keySchema.safeParse(req[key]);
      if (!validationResult.success) {
        ValidationErrors.push({
          key: key,
          issues: validationResult.error.issues,
        });
      }
    }
    if (ValidationErrors.length > 0) {
      throw new BadRequestException("validation error", {
        cause: ValidationErrors,
      });
    }
    next();
  };
};
