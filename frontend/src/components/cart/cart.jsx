import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import API from "../api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  /* =========================
     IMAGE HANDLER (CLOUDINARY ONLY)
  ========================= */
  const getImageSrc = (img) => {
    // ❌ invalid / empty
    if (!img || typeof img !== "string") {
      return "/placeholder-cake.jpg";
    }

    // ✅ Cloudinary image (ONLY ACCEPT THIS)
    if (img.includes("res.cloudinary.com")) {
      return img;
    }

    // ❌ anything else → placeholder
    return "/placeholder-cake.jpg";
  };

  /* =========================
     FETCH CART
  ========================= */
  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      // NOTE: assuming backend returns items array directly
      setCart(res.data);
    } catch (err) {
      console.error("Fetch cart failed", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const updateQty = async (id, type) => {
    try {
      await API.put(`/cart/${id}`, { type });
      fetchCart();
    } catch (err) {
      console.error("Qty update failed", err);
    }
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  /* =========================
     TOTAL
  ========================= */
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <section className="cart-section">
      <h2 className="cart-title">Your Cart</h2>

      {/* EMPTY CART */}
      {cart.length === 0 && (
        <div className="empty-cart-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <h3>Your cart is empty</h3>
          <p>Add something sweet 😄</p>
          <button
            className="shop-now-btn"
            onClick={() => navigate("/treat")}
          >
            SHOP NOW
          </button>
        </div>
      )}

      {/* CART ITEMS */}
      {cart.map((item) => (
        <div className="cart-card" key={item._id}>
          {/* ✅ CLOUDINARY IMAGE WITH FALLBACK */}
          <img
            src={getImageSrc(item.img)}
            alt={item.title}
            className="cart-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-cake.jpg";
            }}
          />

          <div className="cart-info">
            <h3>{item.title}</h3>

            {item.kg && (
              <p className="cart-kg">
                Weight: <strong>{item.kg}</strong>
              </p>
            )}

            <p className="cart-price">₹{item.price}</p>

            <div className="qty-row">
              <button onClick={() => updateQty(item._id, "decrease")}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item._id, "increase")}>+</button>
            </div>

            {item.message && (
              <div className="message-row">
                <span>
                  <strong>Message:</strong> {item.message}
                </span>
                <FiEdit2 className="edit-icon" />
              </div>
            )}
          </div>

          <FiTrash2
            className="delete-icon"
            onClick={() => removeItem(item._id)}
          />
        </div>
      ))}

      {/* BILL */}
      {cart.length > 0 && (
        <div className="bill-box">
          <h3>Order Summary</h3>

          <div className="bill-row">
            <span>Item Total</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="bill-row">
            <span>Delivery Fee</span>
            <span className="free">Free</span>
          </div>

          <div className="bill-row grand">
            <span>Grand Total</span>
            <span>₹{subtotal}</span>
          </div>

          <button
            className="proceed-btn"
            onClick={() => navigate("/checkout")}
          >
            PROCEED TO ORDER
          </button>
        </div>
      )}
    </section>
  );
}
