import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

// ROUTES
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔥 serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/__health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(
    "mongodb+srv://nithiish495:9884973235@nithish.scg7e1e.mongodb.net/GeeshaBakers"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
