import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="success-box">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Thank you for your order ❤️</p>

      <button onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
}
