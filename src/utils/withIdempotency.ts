import { Transaction } from "sequelize";
import { IdempotencyRepository } from "../repositories/IdempotencyRepository";

export async function withIdempotency<T>(
    key: string,
    tx: Transaction,
    handler: () => Promise<T>
): Promise<T> {
    const existing = await IdempotencyRepository.findForUpdate(key, tx);

    if (existing?.response) {
        return existing.response as T;
    }

    if (!existing) {
        await IdempotencyRepository.create(key, tx);
    }

    const result = await handler();

    await IdempotencyRepository.saveResponse(key, result as object, tx);

    return result;
}
