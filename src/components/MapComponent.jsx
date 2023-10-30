import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

// Calculate the distance between two points using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const MapComponent = ({ onMapClick, latLong }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: latLong?.lat || 0,
    lng: latLong?.lng || 0,
  });
  const [mapZoom, setMapZoom] = useState(17); // Initial zoom level

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = latLong ? latLong.lat : position.coords.latitude;
          const lng = latLong ? latLong.lng : position.coords.longitude;
          const newMarkerPosition = { lat, lng };
          setMarkerPosition(newMarkerPosition);
          setMapCenter(newMarkerPosition);

          // Calculate distance between marker and map center
          // const distance = latLong
          //   ? calculateDistance(
          //       mapCenter.lat,
          //       mapCenter.lng,
          //       newMarkerPosition.lat,
          //       newMarkerPosition.lng
          //     )
          //   : 4;
          // Calculate an appropriate zoom level based on distance
          // const newZoom = 17 - Math.log2(distance + 1); // You can adjust the formula as needed
          setMapZoom(17);
        },
        (error) => {
          console.error("Error fetching current location:", error);
        }
      );
    }
  }, [latLong, mapCenter.lat, mapCenter.lng]);

  const handleMapClick = (event) => {
    if (onMapClick) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newMarkerPosition = { lat, lng };
      onMapClick(newMarkerPosition);
      setMarkerPosition(newMarkerPosition);
      setMapCenter(newMarkerPosition);

      // Calculate distance between marker and map center
      const distance = calculateDistance(
        mapCenter.lat,
        mapCenter.lng,
        newMarkerPosition.lat,
        newMarkerPosition.lng
      );
      // Calculate an appropriate zoom level based on distance
      const newZoom = 14 - Math.log2(distance + 1); // You can adjust the formula as needed
      setMapZoom(newZoom);
    }
  };

  return (
    <GoogleMap
      onClick={handleMapClick}
      mapContainerStyle={{ width: "100%", height: "500px" }}
      center={mapCenter}
      zoom={mapZoom}
      mapTypeId="hybrid"
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default MapComponent;
