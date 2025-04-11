import express from "express";
import {
  addStory,
  getStories,
} from "../../controllers/storiesController/storiesController";
const router = express.Router();

router.post("/stories", addStory);
router.get("/stories", getStories);

export default router;
