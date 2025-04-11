"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const offersController_1 = require("../../controllers/offersController/offersController");
const router = express_1.default.Router();
router.post("/offers", offersController_1.addOffer);
router.get("/offers", offersController_1.getOffers);
router.post("/activateOffer", offersController_1.addActiveOfferForUser);
router.get("/getActiveOffer/:userId", offersController_1.getActivatedOffersForUser);
exports.default = router;
