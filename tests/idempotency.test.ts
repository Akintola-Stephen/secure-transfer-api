import request from "supertest";
import app from "../src/app";
import { LedgerEntry } from "../src/models/LedgerEntry";

describe("Idempotency", () => {
    it("should not process the same transfer twice", async () => {
        const payload = {
            fromWalletId: "11111111-1111-1111-1111-111111111111",
            toWalletId: "22222222-2222-2222-2222-222222222222",
            amount: 500,
        };

        const key = "idem-123";

        await request(app)
            .post("/api/transfer")
            .set("Idempotency-Key", key)
            .send(payload);

        await request(app)
            .post("/api/transfer")
            .set("Idempotency-Key", key)
            .send(payload);

        const entries = await LedgerEntry.findAll({
            where: { walletId: payload.fromWalletId },
        });

        const totalDebit = entries
            .filter(e => Number(e.amount) < 0)
            .reduce((a, b) => a + Math.abs(Number(b.amount)), 0);

        expect(totalDebit).toBe(500);
    });
});
