import { Request, Response } from "express";
import { TransferService } from "../services/TransferService";

export class TransferController {
    static async transfer(req: Request, res: Response) {
        const idempotencyKey = req.header("Idempotency-Key")!;

        const { fromWalletId, toWalletId, amount } = req.body;

        const result = await TransferService.transfer({
            fromWalletId,
            toWalletId,
            amount,
            idempotencyKey,
        });

        res.json(result);
    }
}
