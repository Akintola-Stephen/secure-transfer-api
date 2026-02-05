import { sequelize } from "../config/database";
import { LedgerEntry } from "../models/LedgerEntry";
import { withIdempotency } from "../utils/withIdempotency";
import { getWalletBalance } from "../utils/getWalletBalance";
import { TransactionLogRepository } from "../repositories/TransactionLogRepository";

interface TransferInput {
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    idempotencyKey: string;
}

export class TransferService {
    static async transfer(input: TransferInput) {
        return sequelize.transaction(async (tx) => {
            return withIdempotency(
                input.idempotencyKey,
                tx,
                async () => {
                    const log = await TransactionLogRepository.createPending(
                        input,
                        tx
                    );


                    const balance = await getWalletBalance(input.fromWalletId);

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
                }
            );
        });
    }
}
