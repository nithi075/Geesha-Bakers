import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import multer from "multer";

// ROUTES
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/__health", (req, res) => {
  res.json({ ok: true });
});

/* =========================
   ROUTES
========================= */
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);

/* =========================
   🔥 MULTER ERROR HANDLER (IMPORTANT)
========================= */
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
});

/* =========================
   DATABASE
========================= */
mongoose
  .connect(
    "mongodb+srv://nithiish495:9884973235@nithish.scg7e1e.mongodb.net/GeeshaBakers"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
