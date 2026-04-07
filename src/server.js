import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "../src/routes/authRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8001;
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.82.52:3000"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
