import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    console.log("🔥 ORDER API HIT");

    const { name, phone, address, city, pincode } = req.body;

    // 🔴 VALIDATION
    if (!name || !phone || !address || !city || !pincode) {
      return res.status(400).json({ error: "All fields required" });
    }

    // 🔥 GET CART
    const cart = await Cart.findOne();

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 🔥 BUILD WHATSAPP MESSAGE
    let message = `🎂 *NEW CAKE ORDER*\n\n`;
    message += `👤 Name: ${name}\n`;
    message += `📞 Phone: ${phone}\n`;
    message += `🏠 Address: ${address}, ${city} - ${pincode}\n\n`;
    message += `🍰 *Ordered Items:*\n`;

    let total = 0;

    cart.items.forEach((item, index) => {
      // ✅ IMAGE URL FIX
      let imageUrl = "";
      if (item.img) {
        imageUrl = item.img.startsWith("http")
          ? item.img
          : `https://sweettooth-backend.onrender.com${item.img}`;
      }

      // ✅ CAKE PAGE LINK
      const cakeLink = `https://sweettooth-pkaq.onrender.com/cake/${item.productId}`;

      message += `\n${index + 1}. *${item.title}*\n`;
      message += `   Qty: ${item.qty}\n`;
      message += `   Price: ₹${item.price}\n`;

      if (item.message) {
        message += `   Message: "${item.message}"\n`;
      }

      if (imageUrl) {
        message += `   🖼 Image: ${imageUrl}\n`;
      }

      message += `   🔗 Cake Link: ${cakeLink}\n`;

      total += item.price * item.qty;
    });

    message += `\n💰 *Total Amount: ₹${total}*`;

    // 🔥 WHATSAPP URL
    const whatsappURL =
      "https://wa.me/918667041407?text=" +
      encodeURIComponent(message);

    // 🔥 CLEAR CART
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      whatsappURL,
    });
  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    res.status(500).json({ error: "Order failed" });
  }
};
