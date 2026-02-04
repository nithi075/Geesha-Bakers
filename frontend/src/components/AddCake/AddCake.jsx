import { useEffect, useState } from "react";
import "./AddCake.css";
import API from "../api";

export default function AddCake() {
  const [form, setForm] = useState({
    title: "",
    rating: "",
    reviews: "",
    category: "",
    flavor: "",
    occasion: "",
    eggless: false,
    bestseller: false,
  });

  // 🔹 pricing type
  const [pricingType, setPricingType] = useState("kg");

  // 🔹 kg pricing
  const [priceByKg, setPriceByKg] = useState({
    "0.5": "",
    "1": "",
    "2": "",
  });

  // 🔹 piece pricing (for brownies)
  const [priceByPiece, setPriceByPiece] = useState({
    "1": "",
    "6": "",
    "12": "",
  });

  const [cakeMessage, setCakeMessage] = useState("");

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  /* =========================
     CLEANUP PREVIEWS
  ========================= */
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 🔥 auto switch pricing
    if (name === "category") {
      if (value === "brownies") {
        setPricingType("piece");
      } else {
        setPricingType("kg");
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     HANDLE KG PRICE
  ========================= */
  const handleKgPrice = (kg, value) => {
    setPriceByKg((prev) => ({ ...prev, [kg]: value }));
  };

  /* =========================
     HANDLE PIECE PRICE
  ========================= */
  const handlePiecePrice = (qty, value) => {
    setPriceByPiece((prev) => ({ ...prev, [qty]: value }));
  };

  /* =========================
     HANDLE IMAGES
  ========================= */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("❌ Maximum 5 images only");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* =========================
     SUBMIT
  ========================= */
  const submitCake = async (e) => {
    e.preventDefault();

    if (!images.length) {
      alert("❌ Please upload at least one image");
      return;
    }

    if (pricingType === "kg" && !priceByKg["1"]) {
      alert("❌ 1Kg price is required");
      return;
    }

    if (pricingType === "piece" && !priceByPiece["1"]) {
      alert("❌ 1 piece price is required");
      return;
    }

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    data.append("pricingType", pricingType);

    if (pricingType === "kg") {
      data.append("priceByKg", JSON.stringify(priceByKg));
      data.append("cakeMessage", cakeMessage);
    } else {
      data.append("priceByPiece", JSON.stringify(priceByPiece));
    }

    images.forEach((img) => data.append("images", img));

    try {
      await API.post("/products", data);
      alert("🎂 Product Added Successfully!");

      // reset
      setForm({
        title: "",
        rating: "",
        reviews: "",
        category: "",
        flavor: "",
        occasion: "",
        eggless: false,
        bestseller: false,
      });

      setPricingType("kg");
      setPriceByKg({ "0.5": "", "1": "", "2": "" });
      setPriceByPiece({ "1": "", "6": "", "12": "" });
      setCakeMessage("");
      setImages([]);
      setPreviews([]);
    } catch (err) {
      alert(err.response?.data?.error || "❌ Error adding product");
    }
  };

  /* =========================
     JSX
  ========================= */
  return (
    <section className="add-cake-section">
      <h1>Add New Product 🎂</h1>

      <form className="add-cake-form" onSubmit={submitCake}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* CATEGORY */}
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Category</option>
          <option value="classic">Classic</option>
          <option value="occasional">Occasional</option>
          <option value="waffles">Waffles</option>
          <option value="cakepops">Cake Pops</option>
          <option value="cakeslices">Cake Slices</option>
          <option value="brownies">Brownies</option>
          <option value="cupcake">Cup Cake</option>
          <option value="jarcake">Jar Cake</option>
        </select>

        {/* ===== KG PRICE ===== */}
        {pricingType === "kg" && (
          <>
            <h3 className="kg-title">Price by Weight</h3>

            <input
              type="number"
              placeholder="0.5 Kg Price ₹"
              value={priceByKg["0.5"]}
              onChange={(e) => handleKgPrice("0.5", e.target.value)}
            />

            <input
              type="number"
              placeholder="1 Kg Price ₹ (Required)"
              value={priceByKg["1"]}
              onChange={(e) => handleKgPrice("1", e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="2 Kg Price ₹"
              value={priceByKg["2"]}
              onChange={(e) => handleKgPrice("2", e.target.value)}
            />

            <input
              placeholder="Cake Message"
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
            />
          </>
        )}

        {/* ===== PIECE PRICE (BROWNIES) ===== */}
        {pricingType === "piece" && (
          <>
            <h3 className="kg-title">Price by Pieces</h3>

            <input
              type="number"
              placeholder="1 Piece Price ₹ (Required)"
              value={priceByPiece["1"]}
              onChange={(e) => handlePiecePrice("1", e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="6 Pieces Price ₹"
              value={priceByPiece["6"]}
              onChange={(e) => handlePiecePrice("6", e.target.value)}
            />

            <input
              type="number"
              placeholder="12 Pieces Price ₹"
              value={priceByPiece["12"]}
              onChange={(e) => handlePiecePrice("12", e.target.value)}
            />
          </>
        )}

        {/* IMAGES */}
        <input type="file" multiple accept="image/*" onChange={handleImages} />

        <div className="preview-grid">
          {previews.map((src, i) => (
            <div key={i} className="preview-box">
              <img src={src} alt="preview" />
              <span onClick={() => removeImage(i)}>✕</span>
            </div>
          ))}
        </div>

        {/* CHECKBOX */}
        <div className="check-row">
          <label>
            <input
              type="checkbox"
              name="eggless"
              checked={form.eggless}
              onChange={handleChange}
            />
            Eggless
          </label>

          <label>
            <input
              type="checkbox"
              name="bestseller"
              checked={form.bestseller}
              onChange={handleChange}
            />
            Best Seller
          </label>
        </div>

        <button className="add-btn">Add Product</button>
      </form>
    </section>
  );
}
