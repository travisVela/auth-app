import express from "express";
import { conectDB } from "./db/connectDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  conectDB();
  console.log("Server is running on port:", PORT);
});
