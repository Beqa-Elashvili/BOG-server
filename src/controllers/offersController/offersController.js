"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivatedOffersForUser = exports.addActiveOfferForUser = exports.getOffers = exports.addOffer = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const addOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, mainTitle, imageUrl, metaDescription, description } = req.body;
    if (!title || !mainTitle || !imageUrl || !metaDescription || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const offer = yield prisma_1.default.offer.create({
            data: {
                title,
                mainTitle,
                imageUrl,
                metaDescription,
                description,
            },
        });
        return res.status(201).json({
            id: offer.id,
            imageUrl: offer.imageUrl,
            title: offer.title,
            mainTitle: offer.mainTitle,
            metaDescription: offer.metaDescription,
            description: offer.description,
        });
    }
    catch (error) {
        console.error("Error creating offer:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.addOffer = addOffer;
const getOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offers = yield prisma_1.default.offer.findMany();
        return res.status(200).json(offers);
    }
    catch (error) {
        console.error("Error retrieving offers", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getOffers = getOffers;
const addActiveOfferForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, offerId } = req.body;
    if (!userId || !offerId) {
        return res.status(400).json({ error: "User ID and Offer ID are required" });
    }
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const offer = yield prisma_1.default.offer.findUnique({ where: { id: offerId } });
        if (!offer) {
            return res.status(404).json({ error: "Offer not found" });
        }
        const userOffer = yield prisma_1.default.userOffer.upsert({
            where: {
                userId_offerId: { userId, offerId },
            },
            update: {
                isActive: true,
            },
            create: {
                userId,
                offerId,
                isActive: true,
            },
        });
        return res.status(200).json({
            message: "Offer successfully activated for user",
            userOffer,
        });
    }
    catch (error) {
        console.error("Error adding active offer for user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.addActiveOfferForUser = addActiveOfferForUser;
const getActivatedOffersForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        const activatedOffers = yield prisma_1.default.userOffer.findMany({
            where: {
                userId: userId,
                isActive: true,
            },
            include: {
                offer: true,
            },
        });
        if (activatedOffers.length === 0) {
            return res
                .status(404)
                .json({ message: "No active offers found for this user" });
        }
        return res.status(200).json({
            message: "Activated offers for user retrieved successfully",
            activatedOffers: activatedOffers.map((userOffer) => ({
                offerId: userOffer.offer.id,
                title: userOffer.offer.title,
                mainTitle: userOffer.offer.mainTitle,
                imageUrl: userOffer.offer.imageUrl,
                metaDescription: userOffer.offer.metaDescription,
                description: userOffer.offer.description,
            })),
        });
    }
    catch (error) {
        console.error("Error retrieving activated offers for user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getActivatedOffersForUser = getActivatedOffersForUser;
