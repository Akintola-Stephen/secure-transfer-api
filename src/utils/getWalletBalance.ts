import { fn, col, Transaction } from "sequelize";
import { LedgerEntry } from "../models/LedgerEntry";

export async function getWalletBalance(
    walletId: string,
    tx?: Transaction
): Promise<number> {
    const result = await LedgerEntry.findOne({
        attributes: [[fn("SUM", col("amount")), "balance"]],
        where: { walletId },
        transaction: tx,
        raw: true,
    }) as unknown as { balance: string | null };

    return Number(result?.balance ?? 0);
}

