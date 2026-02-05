import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class IdempotencyKey extends Model {
    declare key: string;
    declare response: object | null;
}

IdempotencyKey.init(
    {
        key: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        response: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "idempotency_keys",
    }
);
