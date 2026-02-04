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
  const [price, setPrice] = useState(0);
  const [adding, setAdding] = useState(false);

  // cake
  const [kg, setKg] = useState("1");
  const [message, setMessage] = useState("");

  // pieces
  const [pieceQty, setPieceQty] = useState("1");

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => {
      const data = res.data;
      setCake(data);
      setActiveImg(data.images?.[0] || "");

      // 🔥 category based pricing
      if (data.category === "brownies") {
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

  const isCake = cake.category !== "brownies";

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

      const payload = isCake
        ? {
            productId: cake._id,
            title: cake.title,
            price,
            kg,
            qty: 1,
            img: activeImg,
            message,
          }
        : {
            productId: cake._id,
            title: cake.title,
            price,
            qty: Number(pieceQty),
            img: activeImg,
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
          <span>{isCake ? "Inclusive of taxes" : "/ piece"}</span>
        </div>

        {/* ===== CAKES → KG + MESSAGE ===== */}
        {isCake && (
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

        {/* ===== BROWNIES → PIECES ===== */}
        {!isCake && (
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

      {/* RELATED */}
      {relatedProducts.length > 0 && (
        <section className="india-loves">
          <h1 className="il-title">You may also like</h1>

          <div className="il-grid">
            {relatedProducts.slice(0, 8).map((item) => {
              const relPrice =
                item.category === "brownies"
                  ? item.priceByPiece?.["1"]
                  : item.priceByKg?.["1"];

              return (
                <article
                  key={item._id}
                  className="portrait-card"
                  onClick={() => navigate(`/cake/${item._id}`)}
                >
                  <div className="portrait-img">
                    <img src={item.images?.[0]} alt={item.title} />
                    <span className="price-tag">₹{relPrice}</span>
                  </div>
                  <h3>{item.title}</h3>
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
