import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const MapComponent = ({ onMapClick, latLong }) => {
  // const { isLoaded, loadError } = useJsApiLoader({
  //   googleMapsApiKey: "AIzaSyBUCT5A2vWjzvWNdUQ7bdBv8RxX_Ip_KhQ",
  // });

  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = latLong ? latLong.lat : position.coords.latitude;
          const lng = latLong ? latLong.lng : position.coords.longitude;
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
      mapContainerStyle={{ width: "100%", height: "500px" }}
      center={markerPosition || { lat: 0, lng: 0 }}
      zoom={6}
      mapTypeId="hybrid" // Set map type to "hybrid" to show satellite imagery with labels
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default MapComponent;
