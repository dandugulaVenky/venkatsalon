import Footer from "../../components/footer/Footer";

import "./home.css";
import Layout from "../../components/navbar/Layout";
import Categories from "../carousels/Categories";
import CarouselBanner from "../../components/CarouselBanner";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import Greeting from "../../components/navbar/Greeting";
import Sidebar from "../../components/navbar/SIdebar";
import { SearchContext } from "../../context/SearchContext";
import Services from "../../utils/Services";
import Offers from "../../utils/Offers";
import BestSaloons from "../carousels/BestSaloons";
import useEffectOnce from "../../utils/UseEffectOnce";
import Seo from "../../utils/Seo";
import VideoBackground from "../../components/VideoBackground";
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

  const handleToast = () => {
    toast("Reserved successfully 🎉");

    navigate("/", { state: null });
    return null;
  };

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

  //prompting user to retrive location if not enabled

  const promptEnableLocation = () => {
    if ("geolocation" in navigator) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
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
              const city1 = results[2]?.formatted_address.trim().toLowerCase();

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

  useEffectOnce(() => {
    window.scrollTo(0, 0);

    promptEnableLocation();

    reference !== undefined && reference !== null && handleToast();
    return () => console.log("my effect is destroying");
  }, []);
  const endRef = useRef(null);
  let w = window.innerWidth;

  return (
    <div className="h-auto">
      {open && <Sidebar />}
      {w < 768 && <Greeting bestRef={endRef} />}
      <Seo props={siteMetadata} />

      <div className="home-img1 mb-5">
        <div className="">{w >= 768 && <Layout bestRef={endRef} />}</div>
        <div className="md:min-h-[78vh] min-h-screen flex  flex-col items-center justify-center ">
          <div className="text-container">
            <h1 className="text-[#00ccbb] md:text-6xl text-4xl text-center font-bold">
              Welcome To Easytym
            </h1>
          </div>
          <h1 className="text-gray-700  md:px-10 lg:w-[70vw]  px-4 text-md font-bold md:text-center text-left md:py-5 py-3">
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
      <CarouselBanner />

      <div ref={endRef}>
        <Services />
      </div>

      <div className="flex flex-wrap items-center justify-evenly space-y-1">
        <div
          className="   flex justify-center items-center "
          style={{ marginBottom: "2.5rem" }}
        >
          <div className="md:max-w-[1244px] w-full space-y-8  ">
            <div>
              <BestSaloons />
            </div>
            <div className="">
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
