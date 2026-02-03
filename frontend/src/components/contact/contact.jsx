import { useState } from "react";
import "./contact.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaPaperPlane,
} from "react-icons/fa";
import API from "../api.js";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitMessage = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill required fields");
      return;
    }

    try {
      await API.post("/messages", form);
      alert("Message sent successfully 💗");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="contact-new">

      {/* ===== HERO ===== */}
      <div className="contact-hero-new">
        <h1>Contact Us</h1>
        <p>
          From custom cakes to special events —  
          we’d love to hear from you 🍰
        </p>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="contact-wrapper">

        {/* LEFT – BUSINESS INFO */}
        <div className="contact-card info-card">
          <h2>Get In Touch</h2>

          <div className="contact-item">
            <FaPhoneAlt />
            <span>+91 84282 75557</span>
          </div>

          <div className="contact-item">
            <FaEnvelope />
            <span>geeshabakers@gmail.com</span>
          </div>

          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>Erode, Tamil Nadu</span>
          </div>

          <div className="instagram-box">
            <img src="/images/Insta_profile.jpg" alt="Instagram" />
            <div>
              <h4>@geesha_bakers</h4>
              <p>Daily bakes & dessert reels</p>
              <a
                href="https://www.instagram.com/sweet_tooth_trichy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram /> Follow on Instagram
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT – FORM */}
        <form className="contact-card form-card" onSubmit={submitMessage}>
          <h2>Send a Message</h2>

          <div className="form-grid">
            <input
              name="name"
              placeholder="Your Name *"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number (optional)"
              value={form.phone}
              onChange={handleChange}
            />

            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
            >
              <option value="">Select Subject</option>
              <option>Custom Cake Order</option>
              <option>Event Enquiry</option>
              <option>Course Enquiry</option>
              <option>General Query</option>
            </select>
          </div>

          <textarea
            name="message"
            placeholder="Tell us about your requirement..."
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">
            <FaPaperPlane /> Send Message
          </button>
        </form>
      </div>

      {/* ===== MAP ===== */}
      <div className="contact-map">
        <h2>Visit Our Bakery</h2>
        <p>Experience the sweetness in person 💗</p>

       <iframe
          title="Geesha Bakers Location"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.118979503402!2d77.7275!3d11.3410!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f2f4d0c2f3f%3A0x6c0a5c9b8c7f8a1!2sErode%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000"
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>


      </div>

    </section>
  );
}
