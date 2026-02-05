import request from "supertest";
import app from "../src/app";

describe("Concurrency safety", () => {
    it("should not overspend under concurrent requests", async () => {
        const requests = Array.from({ length: 5 }).map((_, i) =>
            request(app)
                .post("/api/transfer")
                .set("Idempotency-Key", `concurrent-${i}`)
                .send({
                    fromWalletId: "11111111-1111-1111-1111-111111111111",
                    toWalletId: "22222222-2222-2222-2222-222222222222",
                    amount: 10000,
                })
        );

        const results = await Promise.allSettled(requests);

        const successes = results.filter(
            r => r.status === "fulfilled" && r.value.status === 200
        );

        expect(successes.length).toBeLessThanOrEqual(1);
    });
});
