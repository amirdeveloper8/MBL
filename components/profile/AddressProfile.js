import { useContext, useState } from "react";
import classes from "./login.module.css";
import { Form, CloseButton, Row, Col } from "react-bootstrap";
import PlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-places-autocomplete";
import styles from "../../styles/update-profile.module.css";
import AuthContext from "../../store/auth-context";

const AddressProfile = () => {
  const [address, setAddress] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [postalCodeValue, setPostalCodeValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [streetValue, setStreetValue] = useState("");
  const [submitAdress, setSubmitAdress] = useState("");
  const [placeHolder, setPlaceHolder] = useState(false);

  const authCtx = useContext(AuthContext);

  const handleSelect = async (value, placeId) => {
    setAddress(value);
    const [place] = await geocodeByPlaceId(placeId);
    console.log("place", place);
    const { long_name: postalCode = "" } =
      place.address_components.find((c) => c.types.includes("postal_code")) ||
      {};
    const { long_name: city = "" } =
      place.address_components.find((c) => c.types.includes("locality")) || {};
    const { long_name: country = "" } =
      place.address_components.find((c) => c.types.includes("country")) || {};
    const { short_name: state = "" } =
      place.address_components.find((c) =>
        c.types.includes("administrative_area_level_1")
      ) || {};
    const { long_name: streetNumber = "" } =
      place.address_components.find((c) => c.types.includes("street_number")) ||
      {};
    const { long_name: route = "" } =
      place.address_components.find((c) => c.types.includes("route")) || {};

    const street = streetNumber + " " + route;
    setStreetValue(street);
    setCityValue(city);
    setStateValue(state);
    setPostalCodeValue(postalCode);
    setCountryValue(country);
    setPlaceHolder(true);
  };

  const submitHandler = () => {
    const addressBar =
      streetValue +
      ", " +
      cityValue +
      " " +
      stateValue +
      " " +
      postalCodeValue +
      ", " +
      countryValue;
    setSubmitAdress(addressBar);
  };

  return (
    <div className={styles.update}>
      {/* <section className={classes.auth}>
        <CloseButton
          variant="white"
          className={classes.closeButton}
          onClick={authCtx.closeUpdateProfile}
        />
        <h1>Update Your Address</h1>
        <Form>
          <Form.Group
            className="mb-3"
            className={classes.control}
            controlId="formGridAddress1"
          >
            <Form.Label>Address</Form.Label>
            <AddressProfile />
          </Form.Group>

          <Form.Group
            className="mb-3"
            className={classes.control}
            controlId="formGridAddress2"
          >
            <Form.Label>Address 2</Form.Label>
            <Form.Control placeholder="Apartment, studio, or floor" />
          </Form.Group>

          <Row className="mb-3" className={classes.control}>
            <Form.Group as={Col} md={12} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="formGridPost">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Col} md={12} controlId="formGridCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" id="formGridCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
        </Form>
      </section> */}
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        // searchOptions={searchOptions}
        // searchOptions={{ types: ["locality", "country"] }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div key={suggestions.description}>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <h2>address: {address}</h2>
      {placeHolder && (
        <div className={styles.address}>
          <div className={styles.controls}>
            <input
              value={streetValue}
              onChange={(event) => setStreetValue(event.target.value)}
              placeholder={placeHolder ? "type your Street address" : ""}
            />
          </div>

          <div className={styles.controls}>
            <input
              value={cityValue}
              onChange={(event) => setCityValue(event.target.value)}
              placeholder={placeHolder ? "type your City" : ""}
            />
          </div>

          <div className={styles.controls}>
            <input
              value={stateValue}
              onChange={(event) => setStateValue(event.target.value)}
              placeholder={placeHolder ? "type your State" : ""}
            />
          </div>

          <div className={styles.controls}>
            <input
              value={postalCodeValue}
              onChange={(event) => setPostalCodeValue(event.target.value)}
              placeholder={placeHolder ? "type your Postal Code" : ""}
            />
          </div>

          <div className={styles.controls}>
            <input
              value={countryValue}
              onChange={(event) => setCountryValue(event.target.value)}
              placeholder={placeHolder ? "type your Country" : ""}
            />
          </div>
          <button onClick={submitHandler}>Submit</button>
        </div>
      )}
      <h5>address final : {submitAdress}</h5>
    </div>
  );
};

export default AddressProfile;
