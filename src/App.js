// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useContext, useEffect, useRef, useState, Suspense, lazy } from "react";

import Login from "./pages/login/Login";
import Register from "./pages/registration/Register";
import Admin from "./pages/admin/Admin";

import Layout from "./components/navbar/Layout";
import Greeting from "./components/navbar/Greeting";
import Footer from "./components/footer/Footer";
import MobileFooter from "./components/footer/MobileFooter";
import SIdebar from "./components/navbar/SIdebar";

import { AuthContext } from "./context/AuthContext";
import { SearchContext } from "./context/SearchContext";
import LanguageContext from "./context/LanguageContext";

import i18next from "./i18n";

import "./index.css";
import ShopsWithOffer from "./pages/list/ShopsWithOffers";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/home/Home"));
const Hotel = lazy(() => import("./pages/hotel/Hotel"));
const List = lazy(() => import("./pages/list/List"));
const Profile = lazy(() => import("./pages/Profile"));
const BookingHistory = lazy(() => import("./pages/BookingHistory"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PrivacyPolicy = lazy(() => import("./pages/staticpages/PrivacyPolicy"));
const TermsAndConditions = lazy(() =>
  import("./pages/staticpages/TermsAndConditions")
);
const About = lazy(() => import("./pages/staticpages/About"));
const Contact = lazy(() => import("./pages/staticpages/Contact"));
const BookingFailure = lazy(() => import("./components/BookingFailure"));
const Reserve = lazy(() => import("./components/reserve/Reserve"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const Packages = lazy(() => import("./pages/admin/Packages"));
const MyServices = lazy(() => import("./pages/admin/MyServices"));
const AddServices = lazy(() => import("./pages/admin/AddServices"));
const Compare = lazy(() => import("./pages/admin/Compare"));
const AllCities = lazy(() => import("./pages/AllCities/AllCities"));
const FinalRegistration = lazy(() =>
  import("./pages/shopRegistration/FinalRegistration")
);
const ShopDetails = lazy(() => import("./pages/shopRegistration/ShopDetails"));
const Break = lazy(() => import("./pages/admin/Break"));
const Telugu = lazy(() => import("./pages/translation/Telugu"));
const UpdateShopDetails = lazy(() => import("./pages/admin/UpdateShopDetails"));
const AppointmentPaymentSuccess = lazy(() =>
  import("./pages/hotel/AppointmentPaymentSuccess")
);
const AdminAppointments = lazy(() => import("./pages/admin/AdminAppointments"));
const ForgotPassword = lazy(() => import("./pages/login/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/login/ResetPassword"));
const MyBarbers = lazy(() => import("./pages/admin/MyBarbers"));
const Rewards = lazy(() => import("./pages/admin/Rewards"));
const MyOffers = lazy(() => import("./pages/admin/MyOffers"));
const SubscriptionPaymentSuccess = lazy(() =>
  import("./pages/shopRegistration/SubscriptionPaymentSuccess")
);

function App() {
  const { user } = useContext(AuthContext);
  const { open } = useContext(SearchContext);

  const [locale, setLocale] = useState(i18next.language);
  const [smallBanners, setSmallBanners] = useState(window.innerWidth < 431);
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 1064);
  const endRef = useRef(null);

  const handleResize = () => {
    setSmallScreen(window.innerWidth < 1064);
    setSmallBanners(window.innerWidth < 431);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Login />;
    return children;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <BrowserRouter>
        {smallScreen ? (
          <Greeting bestRef={endRef} />
        ) : (
          <Layout bestRef={endRef} />
        )}

        {open && <SIdebar />}

        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={<Home endRef={endRef} smallBanners={smallBanners} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset_password/:phone/:token"
              element={<ResetPassword />}
            />
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
            <Route path="/shops/with-offers" element={<ShopsWithOffer />} />
            <Route path="/cities" element={<AllCities />} />
            <Route
              path="/shops/:id"
              element={<Hotel smallBanners={smallBanners} />}
            />
            <Route path="/shops/:id/:id1" element={<Reserve />} />
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
              path="/admin/my-offers"
              element={
                <ProtectedRoute>
                  <MyOffers />
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
            <Route path="/telugu" element={<Telugu />} />
          </Routes>
        </Suspense>

        {smallScreen ? <MobileFooter /> : <Footer />}
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}

export default App;
