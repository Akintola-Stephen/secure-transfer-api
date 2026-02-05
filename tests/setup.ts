import { sequelize } from "../src/config/database";
import "../src/models";

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});
