import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listing.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(4000,"0.0.0.0", () => {
  console.log("Server running on port 4000");
});