import { useContext, useEffect, useState } from "react";
import classes from "./login.module.css";
import { Form, CloseButton, Row, Col, Alert, Badge } from "react-bootstrap";
import PlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-places-autocomplete";
import AuthContext from "../../store/auth-context";
import Notification from "../ui/notification";
import { ConnectToDB } from "../../lib/connect-to-db";

const UpdateAddress = () => {
  const [address, setAddress] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [postalCodeValue, setPostalCodeValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [streetValue, setStreetValue] = useState("");
  const [address2, setAddress2] = useState("");
  const [placeHolder, setPlaceHolder] = useState(false);

  const [notification, setNotification] = useState();

  const [dataError, setdataError] = useState();

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  useEffect(() => {
    if (notification === "success" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setdataError(null);
        authCtx.closeUpdateAddress();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSelect = async (value, placeId) => {
    setAddress(
      !authCtx.shipAddress || authCtx.shipAddress === ""
        ? value
        : authCtx.shipAddress
    );
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

  let formIsValid = false;

  if (
    (authCtx.address2 || address2) &&
    (authCtx.locality || cityValue) &&
    (authCtx.state || stateValue) &&
    (authCtx.postCode || postalCodeValue) &&
    (authCtx.country || countryValue)
  ) {
    formIsValid = true;
  }

  const connectDB = ConnectToDB("auth/user/update");

  async function createUser(
    shipaddress,
    address2,
    locality,
    state,
    postcode,
    country
  ) {
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${login_token}`,
    };
    const response = await fetch(connectDB, {
      method: "POST",
      body: JSON.stringify({
        shipaddress,
        address2,
        locality,
        state,
        postcode,
        country,
      }),
      credentials: "include",
      headers: headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // throw new Error(data.message || "Something went wrong!");
      setdataError(data.user);
    }

    return data;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    try {
      const result = await createUser(
        authCtx.shipAddress || address,
        authCtx.address2 || address2,
        authCtx.locality || cityValue,
        authCtx.state || stateValue,
        authCtx.postCode || postalCodeValue,
        authCtx.country || countryValue
      );
      console.log(result);
      setNotification(result.status);
      if (result.status === "success") {
        authCtx.addressDetails(
          result.address.shipaddress,
          result.address.address2,
          result.address.locality,
          result.address.state,
          result.address.postcode,
          result.address.country
        );
      }

      setAddress("");
      setAddress2("");
      setCityValue("");
      setCountryValue("");
      setCityValue("");
      setPostalCodeValue("");
    } catch (error) {
      console.log("error", error);
    }
  };

  let notifDetails;

  if (notification === "pending") {
    notifDetails = {
      status: "pending",
      title: "Sending message...",
      message: "Your message is on its way!",
    };
  }

  if (notification === "success") {
    notifDetails = {
      status: "success",
      title: "Success!",
      message: "Message sent successfully!",
    };
  }

  if (notification === "error") {
    notifDetails = {
      status: "error",
      title: "Error!",
      message: dataError,
    };
  }
  return (
    // <div className={styles.update}>
    <section className={classes.auth}>
      <CloseButton
        variant="white"
        className={classes.closeButton}
        onClick={authCtx.closeUpdateAddress}
      />
      <h1>Update Your Address</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group
          className={`${classes.formGroup} mb-3 ${classes.control}`}
          controlId="formGridAddress1"
        >
          <Form.Label>Address</Form.Label>
          {authCtx.shipAddress && authCtx.shipAddress !== "" && (
            <Badge
              className={classes.edit}
              onClick={authCtx.resetShipAddress}
              bg="secondary"
            >
              edit
            </Badge>
          )}
          <PlacesAutocomplete
            value={
              !authCtx.shipAddress || authCtx.shipAddress === ""
                ? address
                : authCtx.shipAddress
            }
            onChange={setAddress}
            onSelect={handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
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
        </Form.Group>

        {(authCtx.shipAddress || address) && (
          <Alert variant="success">
            address:
            {!authCtx.shipAddress || authCtx.shipAddress === ""
              ? address
              : authCtx.shipAddress}
          </Alert>
        )}

        {(authCtx.shipAddress || address) && (
          <Form.Group
            className={`${classes.formGroup} mb-3 ${classes.control}`}
            controlId="formGridAddress2"
          >
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              placeholder="Apartment, studio, or floor"
              value={
                !authCtx.address2 || authCtx.address2 === ""
                  ? address2
                  : authCtx.address2
              }
              onChange={(event) => setAddress2(event.target.value)}
            />
            {authCtx.address2 && authCtx.address2 !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetAddress2}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        )}

        {(authCtx.shipAddress || address) && (
          <Row className="mb-3" className={classes.control}>
            <Form.Group
              className={classes.formGroup}
              as={Col}
              md={12}
              controlId="formGridCity"
            >
              <Form.Label>City</Form.Label>
              <Form.Control
                value={
                  !authCtx.locality || authCtx.locality === ""
                    ? cityValue
                    : authCtx.locality
                }
                onChange={(event) => setCityValue(event.target.value)}
              />
              {authCtx.locality && authCtx.locality !== "" && (
                <Badge
                  className={classes.edit}
                  onClick={authCtx.resetLocality}
                  bg="secondary"
                >
                  edit
                </Badge>
              )}
            </Form.Group>

            <Form.Group
              className={classes.formGroup}
              as={Col}
              md={6}
              controlId="formGridState"
            >
              <Form.Label>State</Form.Label>
              <Form.Control
                value={
                  !authCtx.state || authCtx.state === ""
                    ? stateValue
                    : authCtx.state
                }
                onChange={(event) => setStateValue(event.target.value)}
              />
              {authCtx.state && authCtx.state !== "" && (
                <Badge
                  className={classes.edit}
                  onClick={authCtx.resetState}
                  bg="secondary"
                >
                  edit
                </Badge>
              )}
            </Form.Group>

            <Form.Group
              className={classes.formGroup}
              as={Col}
              md={6}
              controlId="formGridPost"
            >
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                value={
                  !authCtx.postCode || authCtx.postCode === ""
                    ? postalCodeValue
                    : authCtx.postCode
                }
                onChange={(event) => setPostalCodeValue(event.target.value)}
              />
              {authCtx.postCode && authCtx.postCode !== "" && (
                <Badge
                  className={classes.edit}
                  onClick={authCtx.resetPostCode}
                  bg="secondary"
                >
                  edit
                </Badge>
              )}
            </Form.Group>

            <Form.Group
              className={classes.formGroup}
              as={Col}
              md={12}
              controlId="formGridCountry"
            >
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={
                  !authCtx.country || authCtx.country === ""
                    ? countryValue
                    : authCtx.country
                }
                onChange={(event) => setCountryValue(event.target.value)}
              />
              {authCtx.country && authCtx.country !== "" && (
                <Badge
                  className={classes.edit}
                  onClick={authCtx.resetCountry}
                  bg="secondary"
                >
                  edit
                </Badge>
              )}
            </Form.Group>
          </Row>
        )}

        {(authCtx.shipAddress || address) && (
          <Form.Group
            className={classes.formGroup}
            className="mb-3"
            id="formGridCheckbox"
            className={classes.check}
          >
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
        )}
        <div className={classes.actions}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </section>
  );
};

export default UpdateAddress;
