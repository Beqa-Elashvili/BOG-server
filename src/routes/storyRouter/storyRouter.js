"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storiesController_1 = require("../../controllers/storiesController/storiesController");
const router = express_1.default.Router();
router.post("/stories", storiesController_1.addStory);
router.get("/stories", storiesController_1.getStories);
exports.default = router;
