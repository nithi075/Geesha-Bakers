import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill all details");
      return;
    }

    if (form.phone.length !== 10) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/orders", form);

      // 🔥 OPEN WHATSAPP
      if (res.data?.whatsappURL) {
        window.location.href = res.data.whatsappURL;
      } else {
        navigate("/order-success");
      }
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data);
      alert(err.response?.data?.error || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout">
      <h2>Delivery Details</h2>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />

      <button onClick={placeOrder} className="place-btn" disabled={loading}>
        {loading ? "PLACING ORDER..." : "PLACE ORDER"}
      </button>
    </section>
  );
}
