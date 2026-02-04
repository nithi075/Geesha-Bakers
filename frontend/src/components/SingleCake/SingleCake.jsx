import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SingleCake.css";
import API from "../api";
import SingleCakeReview from "../SingleCakesReview/SIngleCakeReview";

export default function SingleCake() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cake, setCake] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const [activeImg, setActiveImg] = useState("");

  // 🔹 common
  const [price, setPrice] = useState(0);
  const [adding, setAdding] = useState(false);

  // 🔹 cake specific
  const [kg, setKg] = useState("1");
  const [message, setMessage] = useState("");

  // 🔹 brownies specific
  const [pieceQty, setPieceQty] = useState("1");

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => {
      const data = res.data;
      setCake(data);
      setActiveImg(data.images?.[0] || "");

      if (data.pricingType === "piece") {
        setPieceQty("1");
        setPrice(data.priceByPiece?.["1"] || 0);
      } else {
        setKg("1");
        setPrice(data.priceByKg?.["1"] || 0);
      }
    });

    API.get("/products").then((res) => {
      setAllProducts(res.data);
    });
  }, [id]);

  if (!cake) return null;

  const relatedProducts = allProducts.filter(
    (p) => p.category === cake.category && p._id !== cake._id
  );

  /* =========================
     HANDLERS
  ========================= */

  const handleKg = (k) => {
    setKg(k);
    setPrice(cake.priceByKg[k]);
  };

  const handlePiece = (p) => {
    setPieceQty(p);
    setPrice(cake.priceByPiece[p]);
  };

  const addToCart = async (redirect = false) => {
    try {
      setAdding(true);

      const payload =
        cake.pricingType === "piece"
          ? {
              productId: cake._id,
              title: cake.title,
              price,
              qty: Number(pieceQty),
              pricingType: "piece",
              img: activeImg,
            }
          : {
              productId: cake._id,
              title: cake.title,
              price,
              kg,
              qty: 1,
              pricingType: "kg",
              img: activeImg,
              message,
            };

      await API.post("/cart", payload);

      if (redirect) navigate("/cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      {/* MAIN IMAGE */}
      <div className="swiggy-img-wrap">
        <img src={activeImg || "/placeholder-cake.jpg"} alt={cake.title} />
      </div>

      {/* SUB IMAGES */}
      {cake.images?.length > 1 && (
        <div className="swiggy-sub-images">
          {cake.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="cake"
              className={activeImg === img ? "active" : ""}
              onClick={() => setActiveImg(img)}
            />
          ))}
        </div>
      )}

      {/* CONTENT */}
      <section className="swiggy-page">
        <h1>{cake.title}</h1>

        <div className="swiggy-price">
          ₹{price}{" "}
          <span>
            {cake.pricingType === "piece" ? "/ piece" : "Inclusive of taxes"}
          </span>
        </div>

        {/* ===== KG SELECT (CAKES) ===== */}
        {cake.pricingType === "kg" && (
          <>
            <div className="swiggy-kg">
              {Object.keys(cake.priceByKg).map((k) => (
                <button
                  key={k}
                  className={kg === k ? "active" : ""}
                  onClick={() => handleKg(k)}
                >
                  {k} Kg
                </button>
              ))}
            </div>

            <div className="swiggy-message">
              <label>Cake Message</label>
              <input
                type="text"
                maxLength={25}
                placeholder="Write your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </>
        )}

        {/* ===== PIECE SELECT (BROWNIES) ===== */}
        {cake.pricingType === "piece" && (
          <div className="swiggy-kg">
            {Object.keys(cake.priceByPiece).map((p) => (
              <button
                key={p}
                className={pieceQty === p ? "active" : ""}
                onClick={() => handlePiece(p)}
              >
                {p} Pieces
              </button>
            ))}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="swiggy-action-row">
          <button
            className="swiggy-buy-btn"
            disabled={adding}
            onClick={() => addToCart(true)}
          >
            BUY NOW
          </button>

          <button
            className="swiggy-add-btn"
            disabled={adding}
            onClick={() => addToCart(false)}
          >
            {adding ? "ADDING..." : "ADD TO CART"}
          </button>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="india-loves">
          <h1 className="il-title">You may also like</h1>
          <p className="il-sub">Customers also loved these items</p>

          <div className="il-grid">
            {relatedProducts.slice(0, 8).map((item) => {
              const relPrice =
                item.pricingType === "piece"
                  ? item.priceByPiece?.["1"]
                  : item.priceByKg?.["1"];

              return (
                <article
                  className="portrait-card"
                  key={item._id}
                  onClick={() => navigate(`/cake/${item._id}`)}
                >
                  <div className="portrait-img">
                    <img
                      src={item.images?.[0] || "/placeholder-cake.jpg"}
                      alt={item.title}
                    />
                    <span className="price-tag">₹{relPrice}</span>
                  </div>

                  <h3 className="portrait-title">{item.title}</h3>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <SingleCakeReview />
    </>
  );
}
