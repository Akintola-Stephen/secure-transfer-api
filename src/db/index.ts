import { sequelize } from "../config/database";
import "../models";

export async function connectDB() {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected & models synced");
}
