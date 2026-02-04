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

  // cakes
  const [kg, setKg] = useState("1");
  const [message, setMessage] = useState("");

  // brownies
  const [pieceQty, setPieceQty] = useState(1);
  const [perPiecePrice, setPerPiecePrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/products/${id}`);
      const data = res.data;

      setCake(data);
      setActiveImg(data.images?.[0] || "");

      if (data.category === "brownies") {
        const ppp = data.priceByPiece?.["1"] || 0;
        setPerPiecePrice(ppp);
        setPieceQty(1);
        setPrice(ppp);
      } else {
        setKg("1");
        setPrice(data.priceByKg?.["1"] || 0);
      }

      const all = await API.get("/products");
      setAllProducts(all.data);
    };

    fetchData();
  }, [id]);

  if (!cake) return null;

  const isCake = cake.category !== "brownies";

  /* =========================
     HANDLERS
  ========================= */

  const handleKg = (k) => {
    setKg(k);
    setPrice(cake.priceByKg[k]);
  };

  const handlePieceQty = (qty) => {
    const q = Math.max(1, Number(qty));
    setPieceQty(q);
  };

  const addToCart = async (redirect = false) => {
    try {
      setAdding(true);

      const payload = isCake
        ? {
            productId: cake._id,
            title: cake.title,
            price,        // ✅ unit price (per cake)
            qty: 1,
            kg,
            img: activeImg,
            message,
          }
        : {
            productId: cake._id,
            title: cake.title,
            price: perPiecePrice, // ✅ unit price
            qty: pieceQty,        // ✅ quantity
            img: activeImg,
          };

      await API.post("/cart", payload);
      await API.get("/cart"); // ✅ ensure backend sync

      if (redirect) navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="swiggy-img-wrap">
        <img src={activeImg || "/placeholder-cake.jpg"} alt={cake.title} />
      </div>

      <section className="swiggy-page">
        <h1>{cake.title}</h1>

        <div className="swiggy-price">
          ₹{isCake ? price : perPiecePrice * pieceQty}
        </div>

        {/* CAKES */}
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

            <input
              type="text"
              maxLength={25}
              placeholder="Cake Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </>
        )}

        {/* BROWNIES */}
        {!isCake && (
          <input
            type="number"
            min="1"
            value={pieceQty}
            onChange={(e) => handlePieceQty(e.target.value)}
          />
        )}

        <div className="swiggy-action-row">
          <button disabled={adding} onClick={() => addToCart(true)}>
            BUY NOW
          </button>

          <button disabled={adding} onClick={() => addToCart(false)}>
            {adding ? "ADDING..." : "ADD TO CART"}
          </button>
        </div>
      </section>

      <SingleCakeReview />
    </>
  );
}
