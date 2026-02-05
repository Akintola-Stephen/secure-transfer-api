import { Request, Response } from "express";
import { getWalletBalance } from "../utils/getWalletBalance";

export class WalletController {
    static async getBalance(req: Request, res: Response) {
        const { walletId } = req.params;
        const walletIdString = Array.isArray(walletId) ? walletId[0] : walletId;

        const balance = await getWalletBalance(walletIdString);

        res.json({
            walletId,
            balance,
        });
    }
}
