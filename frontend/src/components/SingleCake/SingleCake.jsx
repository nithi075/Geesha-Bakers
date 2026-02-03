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
  const [kg, setKg] = useState("1");
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => {
      setCake(res.data);
      setPrice(res.data.priceByKg?.["1"]);
      setActiveImg(res.data.images?.[0] || "");
    });

    API.get("/products").then((res) => {
      setAllProducts(res.data);
    });
  }, [id]);

  if (!cake) return null;

  const relatedProducts = allProducts.filter(
    (p) => p.category === cake.category && p._id !== cake._id
  );

  const handleKg = (k) => {
    setKg(k);
    setPrice(cake.priceByKg[k]);
  };

  const addToCart = async (redirect = false) => {
    try {
      setAdding(true);
      await API.post("/cart", {
        productId: cake._id,
        title: cake.title,
        price,
        kg,
        qty: 1,
        img: activeImg
          ? `http://localhost:5000${activeImg}`
          : "",
        message,
      });

      if (redirect) navigate("/cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      {/* MAIN IMAGE */}
      <div className="swiggy-img-wrap">
        <img
          src={
            activeImg
              ? `http://localhost:5000${activeImg}`
              : "/placeholder-cake.jpg"
          }
          alt={cake.title}
        />
      </div>

      {/* SUB IMAGES */}
      {cake.images?.length > 1 && (
        <div className="swiggy-sub-images">
          {cake.images.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:5000${img}`}
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
          ₹{price} <span>Inclusive of taxes</span>
        </div>

        {/* KG OPTIONS */}
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

        {/* MESSAGE */}
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
    {/* RELATED PRODUCTS – INDIA LOVES STYLE */}
{relatedProducts.length > 0 && (
  <section className="india-loves">
    <h1 className="il-title">You may also like</h1>
    <p className="il-sub">Customers also loved these cakes</p>

    <div className="il-grid">
      {relatedProducts.slice(0, 8).map((item) => (
        <article
          className="portrait-card"
          key={item._id}
          onClick={() => navigate(`/cake/${item._id}`)}
        >
          <div className="portrait-img">
            <img
              src={
                item.images?.[0]
                  ? `http://localhost:5000${item.images[0]}`
                  : "/placeholder-cake.jpg"
              }
              alt={item.title}
            />

            <span className="price-tag">
              ₹{item.priceByKg?.["1"]}
            </span>
          </div>

          <h3 className="portrait-title">{item.title}</h3>
        </article>
      ))}
    </div>
  </section>
)}


      <SingleCakeReview />
    </>
  );
}
