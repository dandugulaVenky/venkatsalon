import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import "./index.css";
import Profile from "./pages/Profile";
import BookingHistory from "./pages/BookingHistory";
import Admin from "./pages/admin/Admin";
import Register from "./pages/registration/Register";

import { PaymentSuccess } from "./pages/PaymentSuccess";
import PrivacyPolicy from "./pages/staticpages/PrivacyPolicy";
import TermsAndConditions from "./pages/staticpages/TermsAndConditions";
import About from "./pages/staticpages/About";
import Contact from "./pages/staticpages/Contact";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import BookingFailure from "./components/BookingFailure";

import Ironing from "./pages/ironing/Ironing";
import Slug from "./pages/ironing/iron-pages/Slug";
import Cart from "./pages/ironing/iron-pages/Cart";
import Shipping from "./pages/ironing/iron-pages/Shipping";
import PlaceOrder from "./pages/ironing/iron-pages/Placeorder";
import Orders from "./pages/ironing/iron-pages/Orders";
import OrderDetails from "./pages/ironing/iron-pages/OrderDetails";
import { IronPaymentSuccess } from "./pages/ironing/iron-pages/IronPaymentSuccess";
import Test from "./pages/Test1";
import ParlourPreview from "./pages/parlourPreview";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/get-started" element={<Home />} /> */}
        <Route path="/shops" element={<List />} />
        <Route path="/test" element={<Test />} />

        <Route path="/shops/:id" element={<Hotel />} />
        <Route path="/shops/:id/parlour-preview" element={<ParlourPreview />} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/failure" element={<BookingFailure />} />
        <Route path="/iron" element={<Ironing />} />
        <Route path="/iron/product/:slug" element={<Slug />} />
        <Route path="/iron/cart" element={<Cart />} />
        <Route path="/iron/shipping" element={<Shipping />} />
        <Route path="/iron/place-order" element={<PlaceOrder />} />
        <Route path="/iron-orders" element={<Orders />} />
        <Route path="/iron/order/:orderid" element={<OrderDetails />} />
        <Route
          path="/iron/iron-payment-success"
          element={<IronPaymentSuccess />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
