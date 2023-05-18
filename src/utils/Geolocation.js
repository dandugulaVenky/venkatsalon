// import React from "react";
// import { useEffect } from "react";

// const Geolocation = () => {
//   useEffect(() => {
//     const enableLocation = () => {
//       if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             // Location is enabled
//             const { latitude, longitude } = position.coords;
//             console.log("Location is enabled.");
//             return alert(latitude);
//             // Continue with your application logic
//           },
//           (error) => {
//             if (error.code === error.PERMISSION_DENIED) {
//               // Location access was denied
//               console.log(
//                 "Location access was denied. Prompting user to enable..."
//               );
//               promptEnableLocation();
//             } else {
//               // Other geolocation errors
//               console.log("Error occurred during geolocation:", error);
//             }
//           },
//           {
//             enableHighAccuracy: true,
//           }
//         );
//       } else {
//         // Geolocation is not supported by the browser
//         console.log("Geolocation is not supported by your browser.");
//       }
//     };
//     enableLocation();
//   }, []);

//   const promptEnableLocation = () => {
//     if ("geolocation" in navigator) {
//       if (navigator.permissions && navigator.permissions.query) {
//         navigator.permissions.query({ name: "geolocation" }).then((result) => {
//           if (result.state === "prompt") {
//             // Prompt user to enable location
//             console.log("Prompting user to enable location...");
//             navigator.geolocation.getCurrentPosition(
//               () => {
//                 // Location is enabled after user prompt
//                 console.log("Location is enabled after user prompt.");
//                 // Continue with your application logic
//               },
//               (error) => {
//                 // Handle any error occurred during geolocation
//                 console.log("Error occurred during geolocation:", error);
//               },
//               {
//                 enableHighAccuracy: true,
//               }
//             );
//           } else {
//             // Permission already denied or granted
//             console.log("Location permission already denied or granted.");
//           }
//         });
//       } else {
//         // Permission API is not supported
//         console.log("Permission API is not supported by your browser.");
//       }
//     } else {
//       // Geolocation is not supported by the browser
//       console.log("Geolocation is not supported by your browser.");
//     }
//   };
// };

// export default Geolocation;
