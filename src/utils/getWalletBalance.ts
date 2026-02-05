import { fn, col } from "sequelize";
import { LedgerEntry } from "../models/LedgerEntry";

export async function getWalletBalance(walletId: string): Promise<number> {
    const result = await LedgerEntry.findOne({
        attributes: [[fn("SUM", col("amount")), "balance"]],
        where: { walletId },
        raw: true,
    }) as unknown as { balance: string | null };

    return Number(result?.balance || 0);
}
