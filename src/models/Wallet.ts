import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Wallet extends Model {
    declare id: string;
}

Wallet.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
    },
    {
        sequelize,
        tableName: "wallets",
    }
);
