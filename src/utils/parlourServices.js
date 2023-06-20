export const parlourServices = ["waxing", "nailing", "facials"];
export const categories = [
  {
    _id: "60cfa69c0b187d0123456789",
    category: "waxing",
    services: [
      {
        _id: "60cfa69c0b187d0123456790",
        name: "waxing1",
        price: 50,
        category: "waxing",
        duration: 50,
      },
      {
        _id: "60cfa69c0b187d0123456791",
        name: "waxing2",
        price: 50,
        category: "waxing",
        duration: 50,
      },
      {
        _id: "60cfa69c0b187d0123456792",
        name: "waxing3",
        price: 50,
        category: "waxing",
        duration: 50,
      },
      {
        _id: "60cfa69c0b187d0123456793",
        name: "waxing4",
        price: 50,
        category: "waxing",
        duration: 50,
      },
    ],
  },
  {
    _id: "60cfa69c0b187d0123456794",
    category: "nailing",
    services: [
      {
        _id: "60cfa69c0b187d0123456795",
        name: "nailing1",
        price: 50,
        category: "nailing",
        duration: 50,
      },
      {
        _id: "60cfa69c0b187d0123456796",
        name: "nailing2",
        price: 50,
        category: "nailing",
        duration: 50,
      },
      {
        _id: "60cfa69c0b187d0123456797",
        name: "nailing3",
        price: 50,
        category: "nailing",
        duration: 50,
      },
    ],
  },
  {
    _id: "60cfa69c0b187d0123456798",
    category: "facials",
    services: [
      {
        _id: "60cfa69c0b187d0123456799",
        name: "facials1",
        price: 50,
        category: "facials",
        duration: 50,
      },
      {
        _id: "60cfa69c0b187d0123456800",
        name: "facials2",
        price: 50,
        category: "facials",
        duration: 50,
      },
      {
        _id: "60cfa69c0b187d0123456801",
        name: "facials3",
        price: 50,
        category: "facials",
        duration: 50,
      },
    ],
  },
];

// const [location, setLocation] = useState();
// const getCurrentPosition = () => {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       const geocoder = new window.google.maps.Geocoder();
//       const latlng = { lat: latitude, lng: longitude };

//       geocoder.geocode({ location: latlng }, (results, status) => {
//         if (status === "OK") {
//           if (results[0]) {
//             const addressComponents = results[0].address_components;
//             // Find the colony or locality name
//             const colony = addressComponents.find(
//               (component) =>
//                 component.types.includes("sublocality") ||
//                 component.types.includes("locality")
//             );
//             if (colony) {
//               alert(colony.long_name);
//               return colony;
//             }
//           } else {
//             console.log("No results found");
//           }
//         } else {
//           console.log("Geocoder failed due to: " + status);
//         }
//       });
//     },
//     (error) => {
//       // Handle any error occurred during geolocation
//       console.log("Error occurred during geolocation:", error);
//     },
//     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//   );
// };
