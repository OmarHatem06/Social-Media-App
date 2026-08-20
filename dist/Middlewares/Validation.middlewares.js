import { BadRequestException } from "../Utils/responses/error.response.js";
export const Validation = (Schema) => {
    return (req, res, next) => {
        const ValidationErrors = [];
        for (const key of Object.keys(Schema)) {
            const keySchema = Schema[key];
            if (!keySchema)
                continue; //the value of the key is undefined skip it
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
