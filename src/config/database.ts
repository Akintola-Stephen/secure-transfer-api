import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";

const isTest = NODE_ENV === "test";

const DB_NAME = isTest
    ? process.env.DB_NAME_TEST
    : process.env.DB_NAME;

if (!DB_NAME) {
    throw new Error("Database name is not defined");
}

export const sequelize = new Sequelize(
    DB_NAME,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        dialect: "postgres",
        logging: isTest ? false : console.log,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            underscored: true,
            timestamps: true,
        },
    }
);
