import Footer from "../../components/footer/Footer";

import "./home.css";
import Layout from "../../components/navbar/Layout";
import Categories from "../carousels/Categories";

import CarouselBanner from "../../components/CarouselBanner";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import Greeting from "../../components/navbar/Greeting";
import Sidebar from "../../components/navbar/SIdebar";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import Services from "../../utils/Services";
import Offers from "../../utils/Offers";

import BestSaloons from "../carousels/BestSaloons";
import secureLocalStorage from "react-secure-storage";
import useEffectOnce from "../../utils/UseEffectOnce";
import Seo from "../../utils/Seo";
import { useEffect } from "react";

const siteMetadata = {
  title: "Home | Effortless Appointments With Easytym",
  description:
    "Easytym provides reliable salon booking services, connecting customers with top-quality beauty parlours and professional ironing services.",
  canonical: "https://easytym.com/get-started",
};

const Home = () => {
  const { open, city, dispatch } = useContext(SearchContext);
  const [homeImg, setHomeImg] = useState(false);
  const promptEnableLocation = () => {
    if ("geolocation" in navigator) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "prompt") {
            // Prompt user to allow or block geolocation permission
            navigator.geolocation.getCurrentPosition(
              () => {
                // Geolocation permission is granted
                console.log("Geolocation permission granted.");
                getCurrentPosition();
              },
              () => {
                dispatch({
                  type: "NEW_SEARCH",
                  payload: {
                    type: "saloon",
                    destination: "No Location!",
                  },
                });
                alert(
                  "Please enable location services to get personalized suggestions!"
                );
              },
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
              }
            );
          } else if (result.state === "granted") {
            // Geolocation permission already granted
            console.log("Geolocation permission already granted.");
            getCurrentPosition();
          } else if (result.state === "denied") {
            // Geolocation permission blocked by the user
            if (city === "No Location!") {
              alert(
                "Please enable location services to get personalized suggestions!"
              );
            }
          }
        });
      } else {
        // Permission API is not supported
        console.log("Permission API is not supported by your browser.");
      }
    } else {
      // Geolocation is not supported by the browser
      console.log("Geolocation is not supported by your browser.");
    }
  };

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };

        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              const city = results[2]?.formatted_address.trim().toLowerCase();

              // Dispatch the necessary information
              dispatch({
                type: "NEW_SEARCH",
                payload: {
                  type: "saloon",
                  destination: city,
                },
              });
            } else {
              console.log("No results found");
            }
          } else {
            console.log("Geocoder failed due to: " + status);
          }
        });
      },
      (error) => {
        // Handle any error occurred during geolocation
        console.log("Error occurred during geolocation:", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const location = useLocation();

  const navigate = useNavigate();

  const [reference, setReference] = useState(location?.state?.referenceNum);

  const handleToast = () => {
    toast("Reserved successfully");

    navigate("/get-started", { state: null });
    return secureLocalStorage.removeItem("bookingDetails");
  };

  const handleButton = async () => {
    try {
      const res = await axios.post(`/api/firebase/send-mobile-notifications`, {
        title: "Hi Easytymers",
        body: "How are you all?",
        imageUrl:
          "https://chat.openai.com/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAGNmyxbquFAyuzcXRZWjLWbOTVvv0xXp89vl4wRbKuDGOlU%3Ds96-c&w=32&q=75",
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHomeImg((prevHomeImg) => !prevHomeImg);
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffectOnce(() => {
    window.scrollTo(0, 0);
    promptEnableLocation();
    reference !== undefined && reference !== null && handleToast();
    return () => console.log("my effect is destroying");
  }, []);
  let w = window.innerWidth;

  return (
    <div className="h-auto">
      {open && <Sidebar />}
      {w < 768 && <Greeting />}
      <Seo props={siteMetadata} />

      <div className={` ${homeImg ? "home-img1" : "home-img2"} mb-5`}>
        <div className=" px-4">{w >= 768 && <Layout />}</div>
        <div className="md:h-[75vh] h-[90vh] flex  flex-col items-center justify-center ">
          <h1 className="text-[#00ccbb] md:text-6xl text-4xl text-center font-bold">
            Hi Welcome To Easytym
          </h1>
          <h1 className="text-gray-700 md:px-64 px-4 text-md font-bold text-center py-5">
            Our company provides convenient and reliable salon booking services,
            connecting customers with top-quality beauty parlours and
            professional ironing services. With our user-friendly platform,
            customers can easily book appointments at their favourite saloons or
            parlours and schedule an at-home pickup and delivery ironing
            service, saving your time and hassle.
          </h1>
        </div>
      </div>
      <CarouselBanner />

      <Services />

      <div className="flex flex-wrap items-center justify-evenly space-y-2">
        <div className=" md:mb-2   flex justify-center items-center ">
          <div className="md:max-w-[1244px] w-full space-y-10 mt-12  ">
            <div className="">
              <BestSaloons />
            </div>
            <div className="">
              <Categories />
            </div>
          </div>
          {/* <Featured /> */}
        </div>
        <Offers />
      </div>
      {/* <button onClick={handleButton} className="mb-20">
        press me
      </button> */}
      <Footer />
    </div>
  );
};

export default Home;
