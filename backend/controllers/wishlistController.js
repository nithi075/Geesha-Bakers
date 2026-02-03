import Cart from "../models/Cart.js";

/* =========================
   GET WISHLIST
========================= */
export const getWishlist = async (req, res) => {
  try {
    let cart = await Cart.findOne();

    if (!cart) {
      cart = new Cart({ items: [], wishlist: [] });
      await cart.save();
    }

    res.json(cart.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   TOGGLE WISHLIST (ADD / REMOVE BY productId)
========================= */
export const toggleWishlist = async (req, res) => {
  try {
    const { productId, title, price, img, badge } = req.body;

    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [], wishlist: [] });
    }

    const index = cart.wishlist.findIndex(
      (item) => item.productId.toString() === productId
    );

    // ❌ exists → remove
    if (index !== -1) {
      cart.wishlist.splice(index, 1);
    }
    // ✅ not exists → add
    else {
      cart.wishlist.push({
        productId,
        title,
        price,
        img,
        badge,
      });
    }

    await cart.save();
    res.json(cart.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   REMOVE WISHLIST (BY productId)
========================= */
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne();
    if (!cart) return res.json([]);

    cart.wishlist = cart.wishlist.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.json(cart.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
