import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SingleCake.css";
import API from "../api";
import SingleCakeReview from "../SingleCakesReview/SIngleCakeReview";

export default function SingleCake() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cake, setCake] = useState(null);
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
    };

    fetchData();
  }, [id]);

  if (!cake) return null;

  const isCake = cake.category !== "brownies";

  const handleKg = (k) => {
    setKg(k);
    setPrice(cake.priceByKg[k]);
  };

  const handlePieceQty = (qty) => {
    setPieceQty(Math.max(1, Number(qty)));
  };

  const addToCart = async (redirect = false) => {
    try {
      setAdding(true);

      const payload = isCake
        ? {
            productId: cake._id,
            title: cake.title,
            price,
            qty: 1,
            kg,
            img: activeImg,
            message,
          }
        : {
            productId: cake._id,
            title: cake.title,
            price: perPiecePrice,
            qty: pieceQty,
            img: activeImg,
          };

      await API.post("/cart", payload);

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

            {/* MESSAGE */}
            <div className="swiggy-message">
              <label>Message on Cake</label>
              <input
                type="text"
                maxLength={25}
                placeholder="Eg: Happy Birthday ❤️"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <span className="char-count">
                {message.length}/25
              </span>
            </div>
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

      <SingleCakeReview />
    </>
  );
}
