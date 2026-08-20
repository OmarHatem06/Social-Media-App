export class ApplicationError extends Error {
    StatusCode;
    constructor(message, StatusCode = 400, options) {
        super(message, options);
        this.StatusCode = StatusCode;
        this.name = this.constructor.name;
    }
}
export class BadRequestException extends ApplicationError {
    constructor(message, options) {
        super(message, 400, options);
    }
}
export class UnauthorizedException extends ApplicationError {
    constructor(message, options) {
        super(message, 401, options);
    }
}
export class NotFoundException extends ApplicationError {
    constructor(message, options) {
        super(message, 404, options);
    }
}
export class ForbiddenException extends ApplicationError {
    constructor(message, options) {
        super(message, 403, options);
    }
}
export const GlobalHandler = (err, req, res, next) => {
    const StatusCode = err.statusCode || 500;
    return res
        .status(StatusCode)
        .json({ message: err.message, cause: err.cause, stack: err.stack });
};
