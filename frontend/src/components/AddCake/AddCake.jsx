import { useState } from "react";
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

  // 🔥 KG BASED PRICE
  const [priceByKg, setPriceByKg] = useState({
    "0.5": "",
    "1": "",
    "2": "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* =========================
     HANDLE KG PRICE
  ========================= */
  const handleKgPrice = (kg, value) => {
    setPriceByKg({
      ...priceByKg,
      [kg]: value,
    });
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
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
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

    if (!priceByKg["1"]) {
      alert("❌ At least 1Kg price is required");
      return;
    }

    const data = new FormData();

    // normal fields
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    // 🔥 priceByKg (IMPORTANT)
    data.append("priceByKg", JSON.stringify(priceByKg));

    // images
    images.forEach((img) => {
      data.append("images", img);
    });

    try {
      await API.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("🎂 Cake Added Successfully!");

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
      setPriceByKg({ "0.5": "", "1": "", "2": "" });
      setImages([]);
      setPreviews([]);
    } catch (err) {
      console.error(err);
      alert("❌ Error adding cake");
    }
  };

  return (
    <section className="add-cake-section">
      <h1>Add New Cake 🎂</h1>

      <form className="add-cake-form" onSubmit={submitCake}>
        <input
          name="title"
          placeholder="Cake Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* ⭐ KG PRICE */}
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
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
        />

        <input
          name="reviews"
          placeholder="Reviews (eg: 2.3K)"
          value={form.reviews}
          onChange={handleChange}
        />

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

        {/* SELECTS */}
        <select name="category" onChange={handleChange}>
          <option value="">Category</option>
          <option value="classic">Classic</option>
          <option value="occasional">Occasional</option>
          <option value="waffles">Waffles</option>
          <option value="cakepops">Cake Pops</option>
          <option value="cakeslices">Cake Slices</option>
          <option value="brownies">Brownies</option>
        </select>

        <select name="flavor" onChange={handleChange}>
          <option value="">Flavor</option>
          <option value="chocolate">Chocolate</option>
          <option value="fruit">Fruit</option>
        </select>

        <select name="occasion" onChange={handleChange}>
          <option value="">Occasion</option>
          <option value="birthday">Birthday</option>
          <option value="anniversary">Anniversary</option>
        </select>

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

        <button className="add-btn">Add Cake</button>
      </form>
    </section>
  );
}
