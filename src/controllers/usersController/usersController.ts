import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma"; // Adjust the import based on your project structure
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password, name, phoneNumber, personalNumber } = req.body;

  if (!email || !password || !name || !phoneNumber || !personalNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }, { personalNumber }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error:
          "User with this email, phone number, or personal number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        personalNumber,
        balance: 55000,
        points: 17500,
      },
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      personalNumber: user.personalNumber,
      createdAt: user.createdAt,
      balance: user.balance,
      points: user.points,
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      personalNumber: user.personalNumber,
      createdAt: user.createdAt,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUser = async (req: Request, res: Response): Promise<any> => {
  const { email, userId, personalNumber } = req.params;
  const { all } = req.query;

  if (!email && !userId && !personalNumber && all !== "true") {
    return res.status(400).json({
      error:
        "At least one parameter (email, userId, or personalNumber) is required",
    });
  }

  try {
    let user;
    if (all === "true") {
      user = await prisma.user.findMany({});
    }
    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } else if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } else if (personalNumber) {
      user = await prisma.user.findUnique({
        where: { personalNumber },
      });
    }

    if (Array.isArray(user)) {
      const userData = user.map(
        ({ password, balance, points, ...rest }) => rest
      );
      return res.status(200).json(userData);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userData } = user;

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(403).json({ error: "Access denied, no token provided" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }

    req.user = user;

    next();
  });
};
