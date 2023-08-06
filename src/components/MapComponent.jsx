import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const MapComponent = ({ onMapClick }) => {
  // const { isLoaded, loadError } = useJsApiLoader({
  //   googleMapsApiKey: "AIzaSyBUCT5A2vWjzvWNdUQ7bdBv8RxX_Ip_KhQ",
  // });

  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    // Fetch the user's current location using browser geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPosition({ lat, lng });
        },
        (error) => {
          console.error("Error fetching current location:", error);
        }
      );
    }
  }, []);

  const handleMapClick = (event) => {
    if (onMapClick) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      onMapClick({ lat, lng });
      setMarkerPosition({ lat, lng });
    }
  };

  return (
    <GoogleMap
      onClick={handleMapClick}
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={markerPosition || { lat: 0, lng: 0 }}
      zoom={6}
      mapTypeId="hybrid" // Set map type to "hybrid" to show satellite imagery with labels
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default MapComponent;
