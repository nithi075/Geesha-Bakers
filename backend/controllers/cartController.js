import Cart from "../models/Cart.js";

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne();

    if (!cart) {
      cart = new Cart({ items: [], wishlist: [] });
      await cart.save();
    }

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, title, price, qty, img, message, kg } = req.body;

    let cart = await Cart.findOne();
    if (!cart) cart = new Cart({ items: [], wishlist: [] });

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.kg === kg
    );

    if (existingItem) {
      existingItem.qty += qty || 1;
    } else {
      cart.items.push({
        productId,
        title,
        price,
        qty: qty || 1,
        img,
        message,
        kg,
      });
    }

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE QTY
========================= */
export const updateQty = async (req, res) => {
  try {
    const { type } = req.body;
    const { id } = req.params;

    const cart = await Cart.findOne();
    if (!cart) return res.json([]);

    const item = cart.items.id(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (type === "increase") item.qty += 1;
    if (type === "decrease" && item.qty > 1) item.qty -= 1;

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   REMOVE FROM CART
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne();
    if (!cart) return res.json([]);

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== id
    );

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
