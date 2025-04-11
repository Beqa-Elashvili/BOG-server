import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { fromUserId, toUserId, amount, destination } = req.body;

  if (!fromUserId || !toUserId || !amount) {
    return res
      .status(400)
      .json({ error: "fromUserId, toUserId, amount, and status are required" });
  }

  try {
    const fromUser = await prisma.user.findUnique({
      where: { id: fromUserId },
    });
    const toUser = await prisma.user.findUnique({
      where: { id: toUserId },
    });

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: "One or both users not found" });
    }

    if (amount > fromUser.balance) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        status: "completed",
        destination: destination,
        fromUserId,
        toUserId,
      },
    });

    const updatedFromUser = await prisma.user.update({
      where: { id: fromUserId },
      data: {
        balance: fromUser.balance - amount,
      },
    });

    const updatedToUser = await prisma.user.update({
      where: { id: toUserId },
      data: {
        balance: toUser.balance + amount,
      },
    });

    return res.status(201).json({
      transaction,
      updatedFromUser,
      updatedToUser,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "userId is required to fetch transactions" });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      include: {
        fromUser: true,
        toUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions found for this user" });
    }

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
