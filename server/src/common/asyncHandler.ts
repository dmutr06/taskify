import { Handler, NextFunction, Response } from "express";
import type { Request } from "./customRequest";

export function asyncHandler<T>(target: (req: Request<T>, res: Response, next?: NextFunction) => Promise<void>): Handler {
    return async (req: Request<T>, res: Response, next: NextFunction) => {
        try {
            await target(req, res, next);
        } catch (e) {
            return next(e);
        }
    };
}
