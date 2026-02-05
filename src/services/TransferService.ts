import { sequelize } from "../config/database";
import { LedgerEntry } from "../models/LedgerEntry";
import { withIdempotency } from "../utils/withIdempotency";
import { getWalletBalance } from "../utils/getWalletBalance";
import { TransactionLogRepository } from "../repositories/TransactionLogRepository";
import { Wallet } from "../models/Wallet";
import { Transaction } from "sequelize";

interface TransferInput {
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    idempotencyKey: string;
}

export class TransferService {
    static async transfer(input: TransferInput) {
        // SERIALIZABLE isolation to prevent concurrent conflicting transfers
        return sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async (tx) => {
            return withIdempotency(input.idempotencyKey, tx, async () => {

                const log = await TransactionLogRepository.createPending(input, tx);

                // Wallet row lock to prevent concurrent modifications
                await Wallet.findByPk(input.fromWalletId, {
                    transaction: tx,
                    lock: tx.LOCK.UPDATE,
                });

                await LedgerEntry.findAll({
                    where: { wallet_id: input.fromWalletId },
                    transaction: tx,
                    lock: tx.LOCK.UPDATE,
                });

                const balance = await getWalletBalance(input.fromWalletId, tx);

                if (balance < input.amount) {
                    await TransactionLogRepository.markFailed(log.id, tx);
                    throw new Error("Insufficient funds");
                }

                await LedgerEntry.bulkCreate(
                    [
                        {
                            walletId: input.fromWalletId,
                            amount: -input.amount,
                            reference: log.id,
                        },
                        {
                            walletId: input.toWalletId,
                            amount: input.amount,
                            reference: log.id,
                        },
                    ],
                    { transaction: tx }
                );

                await TransactionLogRepository.markSuccess(log.id, tx);

                return {
                    transactionId: log.id,
                    status: "SUCCESS",
                };
            });
        });
    }
}