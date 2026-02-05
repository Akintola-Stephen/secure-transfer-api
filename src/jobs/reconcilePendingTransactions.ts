import { TransactionLog, TransactionStatus } from "../models/TransactionLog";
import { LedgerEntry } from "../models/LedgerEntry";
import { Op } from "sequelize";

export async function reconcilePendingTransactions() {
    const stale = await TransactionLog.findAll({
        where: {
            status: TransactionStatus.PENDING,
            createdAt: {
                [Op.lt]: new Date(Date.now() - 5 * 60 * 1000),
            },
        },
    });

    for (const tx of stale) {
        const entries = await LedgerEntry.count({
            where: { reference: tx.id },
        });

        if (entries === 0) {
            await tx.update({ status: TransactionStatus.FAILED });
        }
    }
}
