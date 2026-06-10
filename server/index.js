import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from './routes/address.routes.js';


const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],   // ← fixes the 401s
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/addresses', addressRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use(notFound);
app.use(errorHandler);

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});