"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transitionController_1 = require("../../controllers/transitionController/transitionController");
const router = express_1.default.Router();
router.post("/transaction", transitionController_1.createTransaction);
router.get("/transaction/:userId", transitionController_1.getUserTransactions);
exports.default = router;
