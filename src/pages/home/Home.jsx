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
import banner6 from "../images/you-have-the-power-to-protect-your-time.png";
const siteMetadata = {
  title: "Home | Effortless Appointments With Easytym",
  description:
    "Easytym provides reliable salon booking services, connecting customers with top-quality beauty parlours and professional ironing services.",
  canonical: "https://easytym.com",
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
  //     const res = await axios.post(
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
    //prompting user to retrive location if not enabled

    //setting users current location

    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode({ location: latlng }, (results, status) => {
            const addressComponents = results[0].address_components;
            // Find the colony or locality name
            const colony = addressComponents.find(
              (component) =>
                component.types.includes("sublocality") ||
                component.types.includes("locality")
            );
            if (colony) {
              console.log(colony.long_name);
            }
            console.log(results);
            if (status === "OK") {
              if (results[0]) {
                const city1 = results[2]?.formatted_address
                  .trim()
                  .toLowerCase();

                // Dispatch the necessary information
                dispatch({
                  type: "NEW_SEARCH",
                  payload: {
                    type: "salon",
                    destination: city1,
                    colony,
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
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691922131/easytym_ehuu84.gif",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691923496/2_inpdfe.png",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691923462/3_sbjb2n.png",
      ])
    : (images = [
        banner6,
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
      ]);

  return (
    <div className="h-auto">
      {/* {w < 768 && <Greeting bestRef={endRef} />} */}
      <Seo props={siteMetadata} />

      {/* <div className="">{w >= 768 && <Layout bestRef={endRef} />}</div> */}
      {/* <div className="home-img1 mb-3">
        <div className="md:min-h-[78vh] h-[50vh] flex  flex-col items-center justify-center ">
          <div className="text-container">
            <h1 className=" md:text-6xl text-4xl text-center font-bold ">
              {t("welcome")}
            </h1>
          </div>
          <h1 className="md:text-gray-700 text-white md:px-10 lg:w-[70vw]  px-4 md:text-lg text-sm font-bold md:text-center text-left md:py-5 py-3">
            {t("welcomeMessage")}
          </h1>
        </div>
      </div> */}
      {/* <div>
        <VideoBackground videoUrl={videoUrl} />
      </div> */}
      <div className="grid grid-cols-12 max-w-[1240px]  mx-auto md:px-5  py-8 md:py-6   lg:py-0 lg:pb-5">
        <div
          className="col-span-12 md:col-span-6  home-imgs flex   items-center justify-start px-5"
          style={{ minHeight: "430px" }}
        >
          <div className="">
            <h1 className=" text-5xl md:text-6xl text-center text-[#00ccbb] font-extrabold md:leading-[4rem]">
              {t("welcome")}
            </h1>
            <h1 className="md:text-gray-700 font-bold  py-3">
              {t("welcomeMessage")}
            </h1>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
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
                style={{
                  backgroundPosition: "center",

                  backgroundSize: "cover",
                  width: "100%",
                }}
                alt="carousel-img"
              />
            );
          })}
        </CarouselBanner>
      </div>
      <div className=" md:my-10 xl:my-4">
        <div className="md:max-w-[1244px] w-full mx-auto">
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

      {/* <button onClick={handleButton} className="mb-20">
        press me
      </button> */}
    </div>
  );
};

export default Home;
