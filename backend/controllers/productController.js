import Product from "../models/Product.js";

/* =========================
   GET ALL PRODUCTS
========================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const formatted = products.map((p) => ({
      ...p._doc,
      price: p.priceByKg?.["1"] || 0,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET SINGLE PRODUCT
========================= */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      ...product._doc,
      price: product.priceByKg?.["1"] || 0,
    });
  } catch (err) {
    console.error("GET SINGLE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   CREATE PRODUCT (LOCAL IMAGE)
========================= */
export const createProduct = async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);
    console.log("📸 FILES:", req.files?.length);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // ✅ parse priceByKg
    let priceByKg;
    try {
      priceByKg = JSON.parse(req.body.priceByKg);
    } catch (e) {
      return res.status(400).json({ error: "Invalid priceByKg format" });
    }

    // ✅ local image URLs
    const imageUrls = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );

    const product = new Product({
      title: req.body.title,
      priceByKg,
      rating: Number(req.body.rating || 0),
      reviews: req.body.reviews || "",
      images: imageUrls,
      category: req.body.category,
      flavor: req.body.flavor,
      occasion: req.body.occasion,
      eggless: req.body.eggless === "true",
      bestseller: req.body.bestseller === "true",
    });

    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("🔥 CREATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
