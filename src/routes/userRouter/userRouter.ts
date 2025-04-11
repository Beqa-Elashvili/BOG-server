import { Router, Request } from "express";
import {
  createUser,
  loginUser,
  authenticateToken,
  getUser,
} from "../../controllers/usersController/usersController";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/email/:email", getUser);
router.get("/userId/:userId", getUser);
router.get("/personalNumber/:personalNumber", getUser);
router.get("/users", getUser);

router.get("/protectedRoute", authenticateToken, (req, res) => {
  res.json({
    message: "This is protected data",
    user: (req as Request & { user?: any }).user,
  });
});

export default router;
