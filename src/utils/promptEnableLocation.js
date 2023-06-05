const promptEnableLocation = (dispatch, city) => {
  if ("geolocation" in navigator) {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "prompt") {
          // Prompt user to allow or block geolocation permission
          navigator.geolocation.getCurrentPosition(
            () => {
              console.log("Geolocation permission granted.");
              getCurrentPosition(dispatch);
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
          // getCurrentPosition();
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

const getCurrentPosition = (dispatch) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat: latitude, lng: longitude };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            const city1 = results[2]?.formatted_address.trim().toLowerCase();

            // Dispatch the necessary information
            dispatch({
              type: "NEW_SEARCH",
              payload: {
                type: "saloon",
                destination: city1,
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

export default promptEnableLocation;
