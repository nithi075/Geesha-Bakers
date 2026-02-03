import "./Footer.css";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      {/* SVG CREAM DRIP */}
      <div className="footer-drip">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="
            M0,0
            H1440
            V60
            C1380,90 1320,30 1260,60
            C1200,90 1140,30 1080,60
            C1020,90 960,30 900,60
            C840,90 780,30 720,60
            C660,90 600,30 540,60
            C480,90 420,30 360,60
            C300,90 240,30 180,60
            C120,90 60,30 0,60
            Z" />
        </svg>
      </div>

      <div className="footer-inner">
        {/* BRAND */}
        <div className="footer-brand">
          <img
            src="/images/logo.png"
            alt="Sweet Tooth Logo"
            className="footer-logo-img"
          />
          <h2 className="footer-brand-name">Geesha Bakers</h2>
          <p className="footer-tagline">
            Baked with love. Delivered with care.
          </p>
        </div>

        {/* INFO */}
        <div className="footer-info">
          <div className="info-card">
            <h4>Contact</h4>
            <p><FaPhoneAlt /> +91 84282 75557</p>
            <p><FaMapMarkerAlt /> Erode, Tamil Nadu</p>
          </div>

          <div className="info-card">
            <h4>Social</h4>
            <div className="social-icons">
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        className="footer-bottom"
        onClick={() => (window.location.href = "/add-cake")}
        title="Admin access"
      >
        © {new Date().getFullYear()} Geesha Bakers · Made with ❤️
      </div>
    </footer>
  );
}
