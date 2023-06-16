import React from "react";
import Layout from "../components/navbar/Layout";
import Footer from "../components/footer/Footer";

import useEffectOnce from "../utils/UseEffectOnce";
import { useState, useEffect } from "react";

const Test = () => {
  const [location, setLocation] = useState();
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };

        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              const addressComponents = results[0].address_components;
              // Find the colony or locality name
              const colony = addressComponents.find(
                (component) =>
                  component.types.includes("sublocality") ||
                  component.types.includes("locality")
              );
              if (colony) {
                alert(colony.long_name);
                return colony;
              }
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
  useEffect(() => {
    getCurrentPosition();
  }, []);

  return (
    <>
      <Layout />
      <div class="text-container">
        <h1>Easytym</h1>
      </div>
      <Footer />
    </>
  );
};

export default Test;
