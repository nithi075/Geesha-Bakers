import "./MenuSection.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const categories = [
  { id: 1, title: "CLASSIC", value: "classic", img: "/images/menu/menu1.jpg" },
  { id: 2, title: "OCCASIONAL", value: "occsional", img: "/images/menu/menu3.jpg" },
     {id: 7, title: "BROWNIES", value: "brownies", img: "/images/menu/menu7.jpg" },
  { id: 3, title: "JAR CAKES", value: "jarcakes", img: "/images/menu/menu2.jpg" },
  { id: 4, title: "WAFFLES", value: "waffles", img: "/images/menu/menu4.jpeg" },
  { id: 5, title: "CAKE POPS", value: "cakepops", img: "/images/menu/menu5.jpg" },
  { id: 6, title: "CAKESLICES", value: "cakeslices", img: "/images/menu/menu6.jpeg" },
];

export default function MenuSection() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  return (
    <section className="menu-section">
      {/* Header */}
      <div className="menu-header">
        <div>
          <h2 className="menu-title">What’s on your mind?</h2>
          <p className="menu-sub">Choose a category</p>
        </div>

        <div className="menu-arrows">
          <button onClick={() => scroll("left")}>&lt;</button>
          <button onClick={() => scroll("right")}>&gt;</button>
        </div>
      </div>

      {/* Slider */}
      <div className="menu-slider" ref={sliderRef}>
        {categories.map((item) => (
          <div
            key={item.id}
            className="menu-card"
            onClick={() => navigate(`/treat?category=${item.value}`)}
          >
            <div className="menu-img">
              <img src={item.img} alt={item.title} />
            </div>
            <h3 className="menu-name">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}