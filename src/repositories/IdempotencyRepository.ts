import { Transaction } from "sequelize";
import { IdempotencyKey } from "../models/IdempotencyKey";

export class IdempotencyRepository {
    static findForUpdate(key: string, tx: Transaction) {
        return IdempotencyKey.findByPk(key, {
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });
    }

    static create(key: string, tx: Transaction) {
        return IdempotencyKey.create({ key }, { transaction: tx });
    }

    static saveResponse(
        key: string,
        response: object,
        tx: Transaction
    ) {
        return IdempotencyKey.update(
            { response },
            { where: { key }, transaction: tx }
        );
    }
}
