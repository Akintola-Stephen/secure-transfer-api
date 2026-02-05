import { Transaction } from "sequelize";
import { TransactionLog, TransactionStatus } from "../models/TransactionLog";

export class TransactionLogRepository {
    static createPending(
        data: {
            fromWalletId: string;
            toWalletId: string;
            amount: number;
            idempotencyKey: string;
        },
        tx: Transaction
    ) {
        return TransactionLog.create(
            {
                ...data,
                status: TransactionStatus.PENDING,
            },
            { transaction: tx }
        );
    }

    static markSuccess(id: string, tx: Transaction) {
        return TransactionLog.update(
            { status: TransactionStatus.SUCCESS },
            { where: { id }, transaction: tx }
        );
    }

    static markFailed(id: string, tx: Transaction) {
        return TransactionLog.update(
            { status: TransactionStatus.FAILED },
            { where: { id }, transaction: tx }
        );
    }
}
