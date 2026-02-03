import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Herosection/Herosection";
import MenuSection from "./components/MenuSection/MenuSection";
import Treat from "./components/Treat/Treat";
import Products from "./components/Products/Products";
import CoursesSection from "./components/CourseSection/CourseSection";
import InstaGallery from "./components/InstaGallery/InstaGalley";
import Footer from "./components/Footer/Footer";
import AboutUs from "./components/About/About";
import ContactPage from "./components/contact/contact";
import SingleCake from "./components/SingleCake/SingleCake";
import Cart from "./components/cart/cart";
import AddCake from "./components/AddCake/AddCake";
import Wishlist from "./components/Wishlist/wishlist";
import Checkout from "./components/Checkout/Checkout";
import OrderSuccess from "./components/OrderSuccess/OrderSuccess";
import ReviewPage from "./components/ReviewPage/ReviewPage"; // ✅
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";

function App() {
  return (
    <>
    <Router>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <MenuSection />
              <Products />
              <InstaGallery />
              <WhyChooseUs/>
            </>
          }
        />

        <Route path="/treat" element={<Treat />} />
        <Route path="/cake/:id" element={<SingleCake />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/add-cake" element={<AddCake />} />
        <Route path="/reviews" element={<ReviewPage />} /> {/* ⭐ */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>

     
    </Router>
     <Footer />
     </>
  );
}

export default App;
