import "./home.css";

import Categories from "../carousels/Categories";
import CarouselBanner from "../../components/CarouselBanner";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import { SearchContext } from "../../context/SearchContext";
import Services from "../../utils/Services";
import Offers from "../../utils/Offers";
import BestSaloons from "../carousels/BestSaloons";
import Giffer from "../images/time-flies1.gif";
import Seo from "../../utils/Seo";
import { useTranslation } from "react-i18next";

import useEffectOnce from "../../utils/UseEffectOnce";
// import VideoBackground from "../../components/VideoBackground";
// import banner4 from "../images/banner4.jpg";
// import banner5 from "../images/banner5.jpg";
import img1 from "../images/1.jpg";
import img2 from "../images/2.jpg";
import img3 from "../images/5.jpg";

const siteMetadata = {
  title: "Home | Effortless Appointments With Saalons",
  description:
    "Saalons provides reliable salon booking services, connecting customers with top-quality beauty parlours",
  canonical: "https://saalons.com",
};

const Home = ({ endRef, smallBanners }) => {
  const { city, dispatch } = useContext(SearchContext);

  const location = useLocation();
  // const videoUrl =
  //   "https://res.cloudinary.com/dqupmzcrb/video/upload/v1692353902/An_on_time_services_platform_is0qps.mp4";
  const navigate = useNavigate();

  const [reference, setReference] = useState(location?.state?.referenceNum);
  const { t } = useTranslation();

  // const handleButton = async () => {
  //   try {
  //     const res = await axiosInstance.post(
  //       `${baseUrl}/api/firebase/send-mobile-notifications`,
  //       {
  //         title: "Hi Easytymers",
  //         body: "How are you all?",
  //         imageUrl:
  //           "https://chat.openai.com/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAGNmyxbquFAyuzcXRZWjLWbOTVvv0xXp89vl4wRbKuDGOlU%3Ds96-c&w=32&q=75",
  //       },
  //       { withCredentials: true }
  //     );
  //     console.log(res);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffectOnce(() => {
    toast("Currently in the testing phase...Live coming soon..");

    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode({ location: latlng }, (results, status) => {
            // console.log(results);
            // Find the first address component with types including "postal_code"
            const postalCodeComponent = results.find(
              (component) =>
                component.types.includes("sublocality") ||
                component.types.includes("postal_code")
            );

            const city1 = postalCodeComponent.formatted_address?.toLowerCase();

            // Find the colony or locality name
            // Dispatch the necessary information

            if (status === "OK") {
              if (results[0]) {
                // let string =
                //   results[1]?.address_components[1]?.long_name +
                //   ", " +
                //   results[1]?.address_components[3]?.long_name +
                //   ", " +
                //   results[1]?.address_components[4]?.long_name;

                dispatch({
                  type: "NEW_SEARCH",
                  payload: {
                    type: "salon",
                    destination: city1,
                    pincode: postalCodeComponent.types[0],
                    lat: latitude,
                    lng: longitude,
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

    const promptEnableLocation = () => {
      if ("geolocation" in navigator) {
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions
            .query({ name: "geolocation" })
            .then((result) => {
              if (result.state === "prompt") {
                // Prompt user to allow or block geolocation permission
                navigator.geolocation.getCurrentPosition(
                  () => {
                    console.log("Geolocation permission granted.");
                    getCurrentPosition();
                  },
                  () => {
                    dispatch({
                      type: "NEW_SEARCH",
                      payload: {
                        type: "salon",
                        destination: "No Location!",
                      },
                    });
                    alert(t("enableLocationServices"));
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                  }
                );
              } else if (result.state === "granted") {
                console.log("Geolocation permission already granted.");
                !city && getCurrentPosition();
              } else if (result.state === "denied") {
                if (city === "No Location!") {
                  alert(t("enableLocationServices"));
                }
              }
            });
        } else {
          console.log("Permission API is not supported by your browser.");
        }
      } else {
        console.log("Geolocation is not supported by your browser.");
      }
    };

    const handleToast = () => {
      toast.success("Reserved successfully 🎉");

      navigate("/", { state: null });
      return null;
    };

    // let timeout = setTimeout(() => {
    //   window.scrollTo(0, 0);
    // }, 1000);
    promptEnableLocation();

    reference !== undefined && reference !== null && handleToast();
    localStorage.removeItem("bookingDetails");
    return () => {
      // clearTimeout(timeout);
      console.log("effect");
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
            <h1 className=" text-5xl md:text-6xl text-center text-[#00ccbb] font-extrabold md:leading-[4rem] ">
              {t("welcome")}
            </h1>

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
          <Services />
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
