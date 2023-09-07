import Footer from "../../components/footer/Footer";

import "./home.css";
import Layout from "../../components/navbar/Layout";
import Categories from "../carousels/Categories";
import CarouselBanner from "../../components/CarouselBanner";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Greeting from "../../components/navbar/Greeting";
import Sidebar from "../../components/navbar/SIdebar";
import { SearchContext } from "../../context/SearchContext";
import Services from "../../utils/Services";
import Offers from "../../utils/Offers";
import BestSaloons from "../carousels/BestSaloons";

import Seo from "../../utils/Seo";
// import VideoBackground from "../../components/VideoBackground";
// import banner4 from "../images/banner4.jpg";
// import banner5 from "../images/banner5.jpg";
// import banner6 from "../images/banner6.jpg";
const siteMetadata = {
  title: "Home | Effortless Appointments With Easytym",
  description:
    "Easytym provides reliable salon booking services, connecting customers with top-quality beauty parlours and professional ironing services.",
  canonical: "https://easytym.com",
};

const Home = () => {
  const { open, city, dispatch } = useContext(SearchContext);

  const location = useLocation();
  const videoUrl =
    "https://res.cloudinary.com/dqupmzcrb/video/upload/v1692353902/An_on_time_services_platform_is0qps.mp4";
  const navigate = useNavigate();

  const [reference, setReference] = useState(location?.state?.referenceNum);

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

  useEffect(() => {
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
                    type: "saloon",
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
                console.log("Geolocation permission already granted.");
                !city && getCurrentPosition();
              } else if (result.state === "denied") {
                if (city === "No Location!") {
                  alert(
                    "Please enable location services to get personalized suggestions!"
                  );
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
      toast("Reserved successfully 🎉");

      navigate("/", { state: null });
      return null;
    };

    // let timeout = setTimeout(() => {
    //   window.scrollTo(0, 0);
    // }, 1000);
    promptEnableLocation();

    reference !== undefined && reference !== null && handleToast();
    return () => {
      // clearTimeout(timeout);
      console.log("effect");
    };
  }, [city, dispatch, navigate, reference]);
  const endRef = useRef(null);
  let images = [];
  const w = window.innerWidth;

  w >= 539
    ? (images = [
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691922131/easytym_ehuu84.gif",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691923496/2_inpdfe.png",
        "https://res.cloudinary.com/dqupmzcrb/image/upload/v1691923462/3_sbjb2n.png",
      ])
    : (images = [
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
        "https://res.cloudinary.com/duk9xkcp5/image/upload/v1692469472/A_New_Design_-_Made_with_PosterMyWall_6_ja8ott.jpg",
      ]);

  return (
    <div className="h-auto">
      {open && <Sidebar />}
      {w < 768 && <Greeting bestRef={endRef} />}
      <Seo props={siteMetadata} />

      <div className="home-img1 mb-3">
        <div className="">{w >= 768 && <Layout bestRef={endRef} />}</div>
        <div className="md:min-h-[78vh] h-[50vh] flex  flex-col items-center justify-center ">
          <div className="text-container">
            <h1 className=" md:text-6xl text-4xl text-center font-bold ">
              Welcome To Easytym
            </h1>
          </div>
          <h1 className="md:text-gray-700 text-white md:px-10 lg:w-[70vw]  px-4 md:text-lg text-sm font-bold md:text-center text-left md:py-5 py-3">
            Our company provides convenient and reliable salon booking services,
            connecting customers with top-quality beauty parlours and
            professional ironing services. With our user-friendly platform,
            customers can easily book appointments at their favourite salons or
            parlours and schedule an at-home pickup and delivery ironing
            service, saving your time and hassle.
          </h1>
        </div>
      </div>
      {/* <div>
        <VideoBackground videoUrl={videoUrl} />
      </div> */}
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
      <div>
        <Services />
      </div>

      <div
        className="flex flex-wrap items-center justify-evenly w-full "
        ref={endRef}
      >
        <div className=" w-full  flex justify-center items-center">
          <div className="md:max-w-[1244px] w-full ">
            <div>
              <BestSaloons />
            </div>
            <div>
              <Categories />
            </div>
          </div>
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
