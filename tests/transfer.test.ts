import request from "supertest";
import app from "../src/app";
import { LedgerEntry } from "../src/models/LedgerEntry";

describe("POST /transfer", () => {
    it("should transfer funds correctly", async () => {
        const res = await request(app)
            .post("/api/transfer")
            .set("Idempotency-Key", "tx-1")
            .send({
                fromWalletId: "11111111-1111-1111-1111-111111111111",
                toWalletId: "22222222-2222-2222-2222-222222222222",
                amount: 1000,
            });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("SUCCESS");

        const entries = await LedgerEntry.findAll({
            where: { reference: res.body.transactionId },
        });

        expect(entries.length).toBe(2);

        const debit = entries.find(e => Number(e.amount) < 0);
        const credit = entries.find(e => Number(e.amount) > 0);

        expect(debit?.amount).toBe(-1000);
        expect(credit?.amount).toBe(1000);
    });
});
