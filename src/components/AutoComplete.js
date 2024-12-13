import { faCircleXmark, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";
export default class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
    this.inputRef = React.createRef();
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    const { setHeader, setAddress, dispatch, type, register, bestRef } =
      this.props;

    const handleSelect = (address) => {
      geocodeByAddress(address)
        .then((results) => {
          const location = results[0]?.geometry.location;
          const lat = location?.lat();
          const lng = location?.lng();

          // Use the latitude and longitude as needed
          console.log("Latitude:", lat);
          console.log("Longitude:", lng);

          setAddress(results[0]?.formatted_address.trim().toLowerCase());
          const city = results[0]?.formatted_address.trim().toLowerCase();
          console.log(type, "type");
          dispatch({
            type: "NEW_SEARCH",
            payload: {
              type: !type ? "salon" : type,
              destination: city,
              pincode: city,
              lat: lat,
              lng: lng,
            },
          });
        })
        .catch((error) => console.error("Error", error));

      setTimeout(() => {
        setHeader(false);
      }, 450);

      if (!register) {
        if (bestRef.current) {
          setTimeout(() => {
            bestRef.current.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              if (this.inputRef.current) {
                this.inputRef.current.blur();
              }
              const additionalScrollAmount = -200;
              window.scrollBy({
                top: additionalScrollAmount,
                behavior: "smooth",
              });
            }, 1300);
          }, 1150);
        }
      }
    };

    return (
      <div className="flex items-center justify-center overflow-auto ">
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <div className="flex items-center justify-between mt-16 md:mt-4">
                <input
                  {...getInputProps({
                    placeholder: "Search Places ...",
                    className: "location-search-input",

                    ref: this.inputRef, // Assign the ref to the input element
                  })}
                />
                <span onClick={() => setHeader(false)} className="cross">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    size="sm"
                    color="#00ccbb"
                  />
                </span>
              </div>
              <div className="autocomplete-dropdown-container  ">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion, i) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      className="input-suggestion"
                      key={i}
                      {...getSuggestionItemProps(suggestion, {
                        style,
                      })}
                    >
                      <div className="space-x-3">
                        <FontAwesomeIcon
                          icon={faMapPin}
                          size="lg"
                          color="#00ccbb"
                        />
                        <span className="">{suggestion.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    );
  }
}
