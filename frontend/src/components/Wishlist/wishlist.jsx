import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import API from "../api";
import "./wishlist.css";

/* BACKEND URL */
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://sweettooth-backend.onrender.com";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  /* IMAGE HANDLER */
  const getImageUrl = (img) => {
    if (!img) return "/assets/placeholder.png";
    if (img.startsWith("http")) return img;
    return `${BACKEND_URL}${img}`;
  };

  /* FETCH WISHLIST */
  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlistItems(res.data);
      setWishlistIds(res.data.map((i) => i.productId));
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* TOGGLE WISHLIST */
  const toggleWishlist = async (cake, e) => {
    e.stopPropagation();
    try {
      const res = await API.post("/wishlist", {
        productId: cake.productId,
        title: cake.title,
        price: cake.price,
        img: cake.img,
        badge: cake.badge,
      });

      setWishlistItems(res.data);
      setWishlistIds(res.data.map((i) => i.productId));
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  /* LOADING */
  if (loading) {
    return (
      <section className="wishlist-section">
        <h2 className="wishlist-title">Your Wishlist ❤️</h2>
        <div className="wishlist-loading">Loading wishlist…</div>
      </section>
    );
  }

  /* EMPTY */
  if (wishlistItems.length === 0) {
    return (
      <section className="wishlist-section">
        <h2 className="wishlist-title">Your Wishlist ❤️</h2>
        <div className="wishlist-empty">
          <p>No favourites yet</p>
          <span>Tap ❤️ on cakes to save them</span>
        </div>
      </section>
    );
  }

  /* UI */
  return (
    <section className="wishlist-section">
      {/* 🔥 TITLE */}
      <h2 className="wishlist-title">Your Wishlist ❤️</h2>

      {/* 🔥 CARDS */}
      <div className="treats-grid wishlist-grid">
        {wishlistItems.map((cake) => (
          <div
            key={cake._id}
            className="treat-card"
            onClick={() => navigate(`/cake/${cake.productId}`)}
          >
            <div className="card-img-box">
              <img
                src={getImageUrl(cake.img)}
                alt={cake.title}
                className="treat-img"
                loading="lazy"
                onError={(e) =>
                  (e.currentTarget.src = "/assets/placeholder.png")
                }
              />
              {cake.badge && <span className="badge">{cake.badge}</span>}
            </div>

            <div className="card-content">
              <h3 className="cake-name">{cake.title}</h3>

              <div className="price-heart-row">
                <p className="price">₹{cake.price}</p>

                <FiHeart
                  className={`heart-icon ${
                    wishlistIds.includes(cake.productId) ? "active" : ""
                  }`}
                  onClick={(e) => toggleWishlist(cake, e)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
