import express from "express";
import {
  createTransaction,
  getUserTransactions,
} from "../../controllers/transitionController/transitionController";

const router = express.Router();

router.post("/transaction", createTransaction);
router.get("/transaction/:userId", getUserTransactions);

export default router;
