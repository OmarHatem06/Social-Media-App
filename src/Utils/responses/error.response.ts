import type { NextFunction, Request, Response } from "express";

export interface IERROR extends Error {
  statusCode?: number;
}

export class ApplicationError extends Error {
  constructor(
    message: string,
    public StatusCode: number = 400,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class BadRequestException extends ApplicationError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 400, options);
  }
}

export class UnauthorizedException extends ApplicationError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 401, options);
  }
}

export class NotFoundException extends ApplicationError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 404, options);
  }
}

export class ForbiddenException extends ApplicationError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 403, options);
  }
}

export const GlobalHandler = (
  err: IERROR,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  const StatusCode = err.statusCode || 500;

  return res
    .status(StatusCode)
    .json({ message: err.message, cause: err.cause, stack: err.stack });
};
