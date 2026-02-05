import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class LedgerEntry extends Model {
    declare id: string;
    declare walletId: string;
    declare amount: string;
    declare reference: string;
}

LedgerEntry.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        walletId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: "Positive = credit, Negative = debit",
        },
        reference: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: "TransactionLog ID",
        },
    },
    {
        sequelize,
        tableName: "ledger_entries",
    }
);
