import { Router } from "express";
import { WalletController } from "../controllers/WalletController";

const router = Router();

router.get("/wallets/:walletId/balance", WalletController.getBalance);

export default router;
