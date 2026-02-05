import express from "express";
import walletRoutes from "./routes/wallet.routes";
import transferRoutes from "./routes/transfer.routes";


const app = express();

app.use(express.json());
app.use("/api", walletRoutes);
app.use("/api", transferRoutes);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

export default app;
