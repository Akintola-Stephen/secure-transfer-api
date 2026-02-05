import { Router } from "express";
import { TransferController } from "../controllers/TransferController";
import { requireIdempotencyKey } from "../middlewares/idempotency.middleware";

const router = Router();

router.post(
    "/transfer",
    requireIdempotencyKey,
    TransferController.transfer
);

export default router;
