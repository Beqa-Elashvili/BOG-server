import { User } from "@prisma/client"; // Adjust if necessary based on your Prisma model.

declare global {
  namespace Express {
    interface Request {
      user?: User; // Optional user field to store the user data attached by JWT middleware
    }
  }
}
