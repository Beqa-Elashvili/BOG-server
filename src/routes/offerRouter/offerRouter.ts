import express from "express";
import {
  addOffer,
  getOffers,
  addActiveOfferForUser,
  getActivatedOffersForUser,
} from "../../controllers/offersController/offersController";

const router = express.Router();
router.post("/offers", addOffer);
router.get("/offers", getOffers);
router.post("/activateOffer", addActiveOfferForUser);
router.get("/getActiveOffer/:userId", getActivatedOffersForUser);

export default router;
