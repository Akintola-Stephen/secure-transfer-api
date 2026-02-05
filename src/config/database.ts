import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/wallet",
    {
        dialect: "postgres",
        logging: false,
    }
);
