import { Request, Response } from "express";
import { getWalletBalance } from "../utils/getWalletBalance";

export class WalletController {
    static async getBalance(req: Request, res: Response) {
        const { walletId } = req.params;
        if (!walletId) {
            return res.status(400).json({ message: "walletId is required" });
        }


        const balance = await getWalletBalance(walletId as string);

        res.json({
            walletId,
            balance,
        });
    }
}
