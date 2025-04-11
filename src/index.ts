import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/userRouter/userRouter";
import storyRoutes from "./routes/storyRouter/storyRouter";
import offerRoutes from "./routes/offerRouter/offerRouter";
import transactionsRouter from "./routes/transationsRouter/transactionsRouter";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/transaction", transactionsRouter);

app.get("/hello", (req, res) => {
  res.send("hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});
