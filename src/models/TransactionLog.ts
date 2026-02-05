import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export enum TransactionStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export class TransactionLog extends Model {
    declare id: string;
    declare fromWalletId: string;
    declare toWalletId: string;
    declare amount: string;
    declare status: TransactionStatus;
    declare idempotencyKey: string;
}

TransactionLog.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        fromWalletId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        toWalletId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TransactionStatus)),
            allowNull: false,
        },
        idempotencyKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: "transaction_logs",
    }
);
