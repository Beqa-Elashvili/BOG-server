import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const addOffer = async (req: Request, res: Response): Promise<any> => {
  const { title, mainTitle, imageUrl, metaDescription, description } = req.body;

  if (!title || !mainTitle || !imageUrl || !metaDescription || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const offer = await prisma.offer.create({
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
  } catch (error) {
    console.error("Error creating offer:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getOffers = async (req: Request, res: Response): Promise<any> => {
  try {
    const offers = await prisma.offer.findMany();
    return res.status(200).json(offers);
  } catch (error) {
    console.error("Error retrieving offers", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addActiveOfferForUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, offerId } = req.body;

  if (!userId || !offerId) {
    return res.status(400).json({ error: "User ID and Offer ID are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const offer = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    const userOffer = await prisma.userOffer.upsert({
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
  } catch (error) {
    console.error("Error adding active offer for user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getActivatedOffersForUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const activatedOffers = await prisma.userOffer.findMany({
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
  } catch (error) {
    console.error("Error retrieving activated offers for user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
