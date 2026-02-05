import express from "express";
import walletRoutes from "./routes/wallet.routes";

const app = express();

app.use(express.json());
app.use("/api", walletRoutes);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

export default app;
