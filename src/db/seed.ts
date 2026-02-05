import { sequelize } from "../config/database";
import { Wallet } from "../models/Wallet";
import { LedgerEntry } from "../models/LedgerEntry";

async function seed() {
    await sequelize.sync({ force: true });

    const walletA = await Wallet.create({
        id: "11111111-1111-1111-1111-111111111111",
    });

    const walletB = await Wallet.create({
        id: "22222222-2222-2222-2222-222222222222",
    });

    await LedgerEntry.bulkCreate([
        {
            walletId: walletA.id,
            amount: 100000,
            reference: "INITIAL_FUNDING",
        },
        {
            walletId: walletB.id,
            amount: 50000,
            reference: "INITIAL_FUNDING",
        },
    ]);

    console.log("Seed complete");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
