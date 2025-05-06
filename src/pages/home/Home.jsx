import "./home.css";

import Categories from "../carousels/Categories";
import CarouselBanner from "../../components/CarouselBanner";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { SearchContext } from "../../context/SearchContext";
// import Services from "../../utils/Services";
import Offers from "../../utils/Offers";
import BestSaloons from "../carousels/BestSaloons";
import Giffer from "../images/time-flies1.gif";
import Seo from "../../utils/Seo";
import { useTranslation } from "react-i18next";

import useEffectOnce from "../../utils/UseEffectOnce";
import OffersForYou from "../carousels/OffersForYou";

import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../components/axiosInterceptor";
import baseUrl from "../../utils/client";

// import VideoBackground from "../../components/VideoBackground";
// import banner4 from "../images/banner4.jpg";
// import banner5 from "../images/banner5.jpg";

const siteMetadata = {
  title: "Home | Effortless Appointments With Saalons",
  description:
    "Saalons provides reliable salon booking services, connecting customers with top-quality beauty parlours",
  canonical: "https://saalons.com",
};

const Home = ({ endRef, smallBanners }) => {
  const { city, dispatch } = useContext(SearchContext);
  const { dispatch: dispatch1 } = useContext(AuthContext);

  const location = useLocation();
  // const videoUrl =
  //   "https://res.cloudinary.com/dqupmzcrb/video/upload/v1692353902/An_on_time_services_platform_is0qps.mp4";
  const navigate = useNavigate();

  const [reference, setReference] = useState(location?.state?.referenceNum);
  const { t } = useTranslation();

  const handleButton = async () => {
    try {
      const res = await axiosInstance.post(
        `${baseUrl}/api/firebase/send-notifications`,
        {
          title: "Hi Easytymers",
          body: "How are you all?",
          imageUrl:
            "https://chat.openai.com/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAGNmyxbquFAyuzcXRZWjLWbOTVvv0xXp89vl4wRbKuDGOlU%3Ds96-c&w=32&q=75",
        },
        { withCredentials: true }
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffectOnce(() => {
    const LOCAL_STORAGE_KEY = "userLocation";

    const dispatchLocation = (location) => {
      dispatch({
        type: "NEW_SEARCH",
        payload: {
          type: "salon",
          destination: location.destination || "Enter your location",
          lat: location.lat || 0,
          lng: location.lng || 0,
        },
      });
    };

    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results[0]) {
              const postalOrLocality = results.find(
                (r) =>
                  r.types.includes("sublocality") ||
                  r.types.includes("postal_code")
              );
              const destination =
                postalOrLocality?.formatted_address?.toLowerCase() ||
                results[0].formatted_address.toLowerCase();

              const userLocation = {
                destination,
                lat: latitude,
                lng: longitude,
              };

              // Store and dispatch location
              localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(userLocation)
              );
              dispatchLocation(userLocation);
            } else {
              console.log("Geocoder failed or no results found:", status);
            }
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          alert(t("enableLocationServices"));
          dispatchLocation({ destination: "Enter Location!", lat: 0, lng: 0 });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    };

    const promptLocation = () => {
      if (!("geolocation" in navigator)) {
        console.log("Geolocation is not supported by your browser.");
        return;
      }

      if (navigator.permissions?.query) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            getCurrentPosition();
          } else if (result.state === "denied" && city === "No Location!") {
            alert(t("enableLocationServices"));
          }
        });
      } else {
        // Fallback if Permissions API not supported
        getCurrentPosition();
      }
    };
    window.scrollTo(0, 0);

    // 1. Try cached location first for fast load
    const cachedLocation = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (cachedLocation) {
      dispatchLocation(cachedLocation);
    } else {
      // 2. Then prompt for location (first-time or after clear)
      promptLocation();
    }

    // 3. Handle post-booking toast and cleanup
    if (reference !== undefined && reference !== null) {
      toast.success("Reserved successfully 🎉");
      navigate("/", { state: null });
    }

    localStorage.removeItem("bookingDetails");

    return () => {
      console.log("Cleanup effect");
    };
  }, [city, dispatch, navigate, reference]);

  let images = [];

  !smallBanners
    ? (images = [
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734979201/2_ojl5nt.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734979205/3_jeyh64.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734979556/com_1_h7kdal.svg",
      ])
    : (images = [
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180221/2_l4nngn.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180240/1_vn4gd1.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180222/5_i5nu2y.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180218/4_wyl4vp.svg",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1734180217/3_vwo4mk.svg",

        // img1,
        // img2,
        // img3,
      ]);

  return (
    <div className="h-auto">
      {/* {w < 768 && <Greeting bestRef={endRef} />} */}
      <Seo props={siteMetadata} />

      <div className="grid grid-cols-12 max-w-[1240px]  mx-auto md:px-5  py-2 md:py-6   lg:py-0 lg:pb-5">
        <div
          className="col-span-12 md:col-span-6  home-imgs flex   items-center justify-start md:px-5 md:pt-0 pt-10"
          style={{ minHeight: "430px" }}
        >
          <div className="">
            <h1 className=" text-5xl  text-center text-[#00ccbb] font-extrabold md:leading-[4rem] ">
              {t("welcome")}
            </h1>
            <button onClick={handleButton}>Send</button>

            <div className="col-span-12 md:col-span-6 block md:hidden">
              {/* {!smallBanners ? ( */}
              <img
                src={Giffer}
                alt="gif"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* ) : ( */}
              {/* <img
                  src={mobileImg}
                  alt="gif"
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )} */}
            </div>

            <h1 className="md:text-gray-700 font-bold py-3 hidden md:block">
              {t("welcomeMessage")}
            </h1>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 hidden md:block">
          <img
            src={Giffer}
            alt="gif"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </div>
      <div className={` w-full mx-auto  md:rounded md:px-4`}>
        <CarouselBanner autoSlide={true}>
          {images.map((s) => {
            return (
              <img
                src={s}
                className="md:rounded"
                width={"100%"}
                style={{
                  backgroundPosition: "center",

                  backgroundSize: "fit",
                }}
                alt="carousel-img"
              />
            );
          })}
        </CarouselBanner>
      </div>
      <div className=" md:my-10 xl:my-4">
        <div className="md:max-w-[1240px] w-full mx-auto">
          {/* <Services /> */}
        </div>

        <div
          className="flex flex-wrap items-center justify-evenly w-full"
          ref={endRef}
        >
          <div className=" w-full  flex justify-center items-center">
            <div className="md:max-w-[1244px] w-full ">
              <div>
                <BestSaloons smallBanners={smallBanners} />
              </div>
              <div>
                <OffersForYou smallBanners={smallBanners} />
              </div>
              <div>
                <Categories />
              </div>
              <div>
                <Offers />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
