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
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  render() {
    const { setHeader, setAddress, dispatch, type, register } = this.props;

    const handleSelect = (address) => {
      geocodeByAddress(address)
        .then((results) => {
          setAddress(results[0]?.formatted_address.trim().toLowerCase());
          const city = results[0]?.formatted_address.trim().toLowerCase();

          dispatch({
            type: "NEW_SEARCH",
            payload: {
              type: !type ? "saloon" : type,
              destination: city,
            },
          });
        })

        .catch((error) => console.error("Error", error));
      setTimeout(() => {
        setHeader(false);
      }, 350);

      if (!register) {
        setTimeout(() => {
          window.scrollTo(0, 1200);
        }, 1000);
      }
    };

    return (
      <div className="flex items-center justify-center  my-5 overflow-auto ">
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
              <div className="flex items-center justify-between">
                <input
                  {...getInputProps({
                    placeholder: "Search Places ...",
                    className: "location-search-input",
                  })}
                  autoFocus
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
