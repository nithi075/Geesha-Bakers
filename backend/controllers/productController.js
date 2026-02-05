import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   GET ALL PRODUCTS
========================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const formatted = products.map((p) => {
      const price =
        p.pricingType === "piece"
          ? p.priceByPiece?.["1"] || 0
          : p.priceByKg?.["1"] || 0;

      return {
        ...p._doc,
        price,
      };
    });

    res.json(formatted);
  } catch (err) {
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

    const price =
      product.pricingType === "piece"
        ? product.priceByPiece?.["1"] || 0
        : product.priceByKg?.["1"] || 0;

    res.json({
      ...product._doc,
      price,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (req, res) => {
  try {
    const { pricingType, category, flavour, occasionType } = req.body;

    if (!pricingType) {
      return res.status(400).json({ error: "pricingType is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    let priceByKg = {};
    let priceByPiece = {};

    if (pricingType === "kg") {
      try {
        priceByKg = JSON.parse(req.body.priceByKg);
        if (!priceByKg["1"]) {
          return res.status(400).json({ error: "1Kg price required" });
        }
      } catch {
        return res.status(400).json({ error: "Invalid priceByKg format" });
      }
    }

    if (pricingType === "piece") {
      try {
        priceByPiece = JSON.parse(req.body.priceByPiece);
        if (!priceByPiece["1"]) {
          return res.status(400).json({ error: "1 piece price required" });
        }
      } catch {
        return res.status(400).json({ error: "Invalid priceByPiece format" });
      }
    }

    /* ---------- Upload Images ---------- */
    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "cakes",
                resource_type: "image",
                quality: "auto",
                fetch_format: "auto",
              },
              (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
              }
            )
            .end(file.buffer);
        })
    );

    const imageUrls = await Promise.all(uploadPromises);

    /* ---------- Cake Message Rule ---------- */
    let cakeMessage = req.body.cakeMessage || "";
    if (category === "brownies") {
      cakeMessage = "";
    }

    /* ---------- Create Product ---------- */
    const product = new Product({
      title: req.body.title,
      description: req.body.description || "",

      category,
      pricingType,
      priceByKg,
      priceByPiece,
      cakeMessage,

      images: imageUrls,

      // ✅ FIXED FIELD NAMES
      flavour: flavour || "",
      occasionType: occasionType || "",

      eggless: req.body.eggless === "true" || req.body.eggless === true,
      bestseller:
        req.body.bestseller === "true" || req.body.bestseller === true,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { pricingType, category, flavour, occasionType } = req.body;

    let priceByKg = {};
    let priceByPiece = {};

    if (pricingType === "kg") {
      priceByKg = JSON.parse(req.body.priceByKg || "{}");
    }

    if (pricingType === "piece") {
      priceByPiece = JSON.parse(req.body.priceByPiece || "{}");
    }

    let images = [];

    if (req.body.existingImages) {
      images = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    if (req.files && req.files.length > 0) {
      const uploads = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "cakes" }, (err, result) => {
                if (err) reject(err);
                else resolve(result.secure_url);
              })
              .end(file.buffer);
          })
      );

      const newUrls = await Promise.all(uploads);
      images = [...images, ...newUrls];
    }

    if (images.length > 5) {
      return res.status(400).json({ error: "Maximum 5 images allowed" });
    }

    /* ---------- Update Fields ---------- */
    product.title = req.body.title;
    product.description = req.body.description || "";

    product.category = category;
    product.pricingType = pricingType;
    product.priceByKg = priceByKg;
    product.priceByPiece = priceByPiece;
    product.cakeMessage = category === "brownies" ? "" : req.body.cakeMessage;

    product.images = images;

    // ✅ FIXED FIELD NAMES
    product.flavour = flavour || "";
    product.occasionType = occasionType || "";

    product.eggless = req.body.eggless === "true" || req.body.eggless === true;
    product.bestseller =
      req.body.bestseller === "true" || req.body.bestseller === true;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
