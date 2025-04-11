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
exports.getStories = exports.addStory = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const addStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }
    try {
        const story = yield prisma_1.default.story.create({
            data: {
                imageUrl,
            },
        });
        return res.status(201).json({
            id: story.id,
            imageUrl: story.imageUrl,
            createdAt: story.createdAt,
        });
    }
    catch (error) {
        console.error("Error creating story:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.addStory = addStory;
const getStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stories = yield prisma_1.default.story.findMany();
        return res.status(200).json(stories);
    }
    catch (error) {
        console.error("Error retrieving stories:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getStories = getStories;
