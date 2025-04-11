import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const addStory = async (req: Request, res: Response): Promise<any> => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    const story = await prisma.story.create({
      data: {
        imageUrl,
      },
    });

    return res.status(201).json({
      id: story.id,
      imageUrl: story.imageUrl,
      createdAt: story.createdAt,
    });
  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getStories = async (req: Request, res: Response): Promise<any> => {
  try {
    const stories = await prisma.story.findMany();
    return res.status(200).json(stories);
  } catch (error) {
    console.error("Error retrieving stories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
