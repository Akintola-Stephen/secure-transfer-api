import { Request, Response, NextFunction } from "express";

export function requireIdempotencyKey(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const key = req.header("Idempotency-Key");

    if (!key) {
        return res.status(400).json({
            error: "Idempotency-Key header is required",
        });
    }

    next();
}
