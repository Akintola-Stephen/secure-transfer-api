import { sequelize } from "../src/config/database";
import { LedgerEntry, Wallet } from "../src/models";


beforeAll(async () => {
    await sequelize.sync({ force: true });
    console.log("Test DB synced");

    await Wallet.bulkCreate([
        { id: "11111111-1111-1111-1111-111111111111" },
        { id: "22222222-2222-2222-2222-222222222222" },
    ]);
    console.log("Wallets created");

    await LedgerEntry.bulkCreate([
        {
            walletId: "11111111-1111-1111-1111-111111111111",
            amount: 20000.00,
            reference: "INITIAL_FUNDING",
        },
        {
            walletId: "22222222-2222-2222-2222-222222222222",
            amount: 10000.00,
            reference: "INITIAL_FUNDING",
        },
    ]);
    console.log("Ledger entries seeded successfully");
});

afterAll(async () => {
    await sequelize.close();
});