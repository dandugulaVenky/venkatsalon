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
import { useContext, useEffect, useRef, Suspense, lazy } from "react";
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

import Reserve from "./components/reserve/Reserve";
// import ParlorReserve from "./components/reserve/ParlorReserve";

import AdminOrders from "./pages/admin/AdminOrders";
import Packages from "./pages/admin/Packages";
import MyServices from "./pages/admin/MyServices";
import AddServices from "./pages/admin/AddServices";
import Compare from "./pages/admin/Compare";
import AllCities from "./pages/AllCities/AllCities";
// import RegistrationForm from "./pages/shopRegistration/RegistrationForm";
import FinalRegistration from "./pages/shopRegistration/FinalRegistration";
import ShopDetails from "./pages/shopRegistration/ShopDetails";
import Break from "./pages/admin/Break";
import Telugu from "./pages/translation/Telugu";
import i18next from "./i18n";
import LanguageContext from "./context/LanguageContext";
import { useState } from "react";
import Layout from "./components/navbar/Layout";
import Greeting from "./components/navbar/Greeting";
import MobileFooter from "./components/footer/MobileFooter";
import Footer from "./components/footer/Footer";
import { SearchContext } from "./context/SearchContext";
import SIdebar from "./components/navbar/SIdebar";
import UpdateShopDetails from "./pages/admin/UpdateShopDetails";
import AppointmentPaymentSuccess from "./pages/hotel/AppointmentPaymentSuccess";
import AdminAppointments from "./pages/admin/AdminAppointments";
import ForgotPassword from "./pages/login/ForgotPassword";
import ResetPassword from "./pages/login/ResetPassword";
import MyBarbers from "./pages/admin/MyBarbers";
import Rewards from "./pages/admin/Rewards";
import SubscriptionPaymentSuccess from "./pages/shopRegistration/SubscriptionPaymentSuccess";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      // return <Navigate to="/login" />;
      return <Login />;
    }

    return children;
  };
  const [locale, setLocale] = useState(i18next.language);
  const { open } = useContext(SearchContext);
  const [smallBanners, setSmallBanners] = useState(window.innerWidth < 431);
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 1064);
  const handleResize = (e) => {
    setSmallScreen(window.innerWidth < 1064);
    setSmallBanners(window.innerWidth < 431);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const endRef = useRef(null);

  return (
    <>
      <LanguageContext.Provider value={{ locale, setLocale }}>
        <BrowserRouter>
          {smallScreen ? (
            <Greeting bestRef={endRef} />
          ) : (
            <Layout bestRef={endRef} />
          )}

          {open && <SIdebar />}
          <Routes>
            <Route
              path="/"
              element={<Home endRef={endRef} smallBanners={smallBanners} />}
            />
            {/* <Route path="/get-started" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset_password/:phone/:token"
              element={<ResetPassword />}
            />

            {/* <Route path="/shop-registration" element={<RegistrationForm />} /> */}
            <Route path="/shop-details" element={<ShopDetails />} />
            <Route
              path="/shop-final-registration"
              element={<FinalRegistration />}
            />
            <Route
              path="/subscription-payment-success"
              element={
                <ProtectedRoute>
                  <SubscriptionPaymentSuccess />
                </ProtectedRoute>
              }
            />

            <Route path="/shops" element={<List />} />
            <Route path="/cities" element={<AllCities />} />

            <Route
              path="/shops/:id"
              element={<Hotel smallBanners={smallBanners} />}
            />
            <Route path="/shops/:id/:id1" element={<Reserve />} />

            {/* <Route
              path="/shops/:id/parlour-reserve"
              element={<ParlorReserve />}
            /> */}

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
            <Route
              path="/admin/rewards"
              element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute>
                  <AdminAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/packages"
              element={
                <ProtectedRoute>
                  <Packages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/my-services"
              element={
                <ProtectedRoute>
                  <MyServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/my-barbers"
              element={
                <ProtectedRoute>
                  <MyBarbers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/add-services"
              element={
                <ProtectedRoute>
                  <AddServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/compare"
              element={
                <ProtectedRoute>
                  <Compare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/break"
              element={
                <ProtectedRoute>
                  <Break />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/update-shop-details"
              element={
                <ProtectedRoute>
                  <UpdateShopDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            {/* appointment payment success */}
            <Route
              path="/appointment/appointment-payment-success"
              element={
                <ProtectedRoute>
                  <AppointmentPaymentSuccess />
                </ProtectedRoute>
              }
            />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/failure" element={<BookingFailure />} />
            {/* <Route path="/iron" element={<Ironing />} />
            <Route path="/iron/product/:slug" element={<Slug />} />
            <Route path="/iron/cart" element={<Cart />} />
            <Route path="/iron/shipping" element={<Shipping />} />
            <Route path="/iron/place-order" element={<PlaceOrder />} />
            <Route path="/iron-orders" element={<Orders />} />
            <Route path="/iron/order/:orderid" element={<OrderDetails />} />
            <Route
              path="/iron/iron-payment-success"
              element={<IronPaymentSuccess />}
            /> */}
            <Route path="/telugu" element={<Telugu />} />
          </Routes>
          {smallScreen ? <MobileFooter /> : <Footer />}
        </BrowserRouter>
      </LanguageContext.Provider>
    </>
  );
}

export default App;
