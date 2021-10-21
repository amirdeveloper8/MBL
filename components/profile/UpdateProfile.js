import classes from "./login.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../lib/connect-to-db";
import useInput from "../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../ui/notification";
import AddressProfile from "./AddressProfile";

const isEmail = (value) => value.includes("@");
const isText = (value) => value.trim().length > 0;
const isMobile = (value) => value.trim().length === 11;
const isPrefix = (value) => value.trim() !== "Choose...";

const UpdateProfile = () => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;
  const router = useRouter();

  useEffect(() => {
    if (notification === "success" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setdataError(null);
        authCtx.closeUpdateProfile();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const {
    value: prefixValue,
    isValid: prefixIsValid,
    hasError: prefixHasError,
    valueChangeHandler: prefixChangeHandler,
    inputBlurHandler: prefixBlurHandler,
    reset: resetPrefix,
  } = useInput(isPrefix);

  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstName,
  } = useInput(isText);

  const {
    value: middleNameValue,
    isValid: middleNameIsValid,
    hasError: middleNameHasError,
    valueChangeHandler: middleNameChangeHandler,
    inputBlurHandler: middleNameBlurHandler,
    reset: resetMiddleName,
  } = useInput(isText);

  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastName,
  } = useInput(isText);

  const {
    value: mobileNumberValue,
    isValid: mobileNumberIsValid,
    hasError: mobileNumberHasError,
    valueChangeHandler: mobileNumberChangeHandler,
    inputBlurHandler: mobileNumberBlurHandler,
    reset: resetMobileNumber,
  } = useInput(isMobile);

  const {
    value: telephoneNumberValue,
    isValid: telephoneNumberIsValid,
    valueChangeHandler: telephoneNumberChangeHandler,
    inputBlurHandler: telephoneNumberBlurHandler,
    reset: resetTelephoneNumber,
  } = useInput(isText);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(isEmail);

  let formIsValid = false;

  if (
    (prefixIsValid || authCtx.prefix !== "") &&
    (firstNameIsValid || authCtx.firstName !== "") &&
    (lastNameIsValid || authCtx.lastName !== "") &&
    (emailIsValid || authCtx.mobileNumber !== "") &&
    (mobileNumberIsValid || authCtx.email !== "")
  ) {
    formIsValid = true;
  }

  const connectDB = ConnectToDB("auth/user/update");

  async function createUser(
    prefix,
    firstname,
    middlename,
    lastname,
    mobile,
    telephone,
    email
  ) {
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${login_token}`,
    };
    const response = await fetch(connectDB, {
      method: "POST",
      body: JSON.stringify({
        prefix,
        firstname,
        middlename,
        lastname,
        mobile,
        telephone,
        email,
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
        authCtx.prefix || prefixValue,
        authCtx.firstName || firstNameValue,
        authCtx.middleName || middleNameValue,
        authCtx.lastName || lastNameValue,
        authCtx.mobileNumber || mobileNumberValue,
        authCtx.telephoneNumber || telephoneNumberValue,
        authCtx.email || emailValue
      );
      console.log(result);
      setNotification(result.status);
      if (result.status === "success") {
        authCtx.userDetails(
          result.user.prefix,
          result.user.firstname,
          result.user.lastname,
          result.user.middlename,
          result.user.mobile,
          result.user.telephone,
          result.user.email
        );
      }
    } catch (error) {
      console.log("error", error);
    }

    resetEmail();
    resetFirstName();
    resetLastName();
    resetMiddleName();
    resetMobileNumber();
    resetPrefix();
    resetTelephoneNumber();
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
    <section className={classes.auth}>
      <CloseButton
        variant="white"
        className={classes.closeButton}
        onClick={authCtx.closeUpdateProfile}
      />
      <h1>Update Your Profile</h1>
      <Form onSubmit={submitHandler}>
        <Row className="mb-3" className={classes.control}>
          <Form.Group
            as={Col}
            md={12}
            controlId="formGridPrefix"
            className={classes.formGroup}
          >
            <Form.Label>Prefix*</Form.Label>
            <Form.Select
              required
              value={
                !authCtx.prefix || authCtx.prefix === ""
                  ? prefixValue
                  : authCtx.prefix
              }
              onChange={prefixChangeHandler}
              onBlur={prefixBlurHandler}
            >
              <option>Choose...</option>
              <option>Mr</option>
              <option>Ms</option>
              <option>Other</option>
            </Form.Select>
            {prefixHasError && (
              <Alert className="mt-1" variant="danger">
                Please Choose a valid Prefix.
              </Alert>
            )}
            {authCtx.prefix && authCtx.prefix !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetPrefix}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>
        <Row className="mb-3" className={classes.control}>
          <Form.Group
            as={Col}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>First Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={
                !authCtx.firstName || authCtx.firstName === ""
                  ? firstNameValue
                  : authCtx.firstName
              }
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
            />

            {firstNameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid First Name.
              </Alert>
            )}
            {authCtx.firstName && authCtx.firstName !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetFname}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="formGridMName"
            className={classes.formGroup}
          >
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Middle Name"
              value={
                !authCtx.middleName || authCtx.middleName === ""
                  ? middleNameValue
                  : authCtx.middleName
              }
              onChange={middleNameChangeHandler}
              onBlur={middleNameBlurHandler}
            />
            {authCtx.middleName && authCtx.middleName !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetMname}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="formGridLName"
            className={classes.formGroup}
          >
            <Form.Label>Last Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              required
              value={
                !authCtx.lastName || authCtx.lastName === ""
                  ? lastNameValue
                  : authCtx.lastName
              }
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
            />
            {lastNameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Last Name.
              </Alert>
            )}
            {authCtx.lastName && authCtx.lastName !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetLname}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>

        <Row className="mb-3" className={classes.control}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Mobile Number*</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Your Mobile Number"
              required
              value={
                !authCtx.mobileNumber || authCtx.mobileNumber === ""
                  ? mobileNumberValue
                  : authCtx.mobileNumber
              }
              onChange={mobileNumberChangeHandler}
              onBlur={mobileNumberBlurHandler}
            />
            {mobileNumberHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Phone Number.
              </Alert>
            )}
            {authCtx.middleName && authCtx.middleName !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetMobile}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="formGridPhone"
            className={classes.formGroup}
          >
            <Form.Label>Telephone Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Your Telephone Number"
              value={
                !authCtx.telephoneNumber || authCtx.telephoneNumber == ""
                  ? telephoneNumberValue
                  : authCtx.telephoneNumber
              }
              onChange={telephoneNumberChangeHandler}
              onBlur={telephoneNumberBlurHandler}
            />
            {authCtx.telephoneNumber && authCtx.telephoneNumber !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetTelephone}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="formGridEmail"
            className={classes.formGroup}
          >
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Your Telephone Email"
              required
              value={
                !authCtx.email || authCtx.email === ""
                  ? emailValue
                  : authCtx.email
              }
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            />

            {emailHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid email address.
              </Alert>
            )}
            {authCtx.email && authCtx.email !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetEmail}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>
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

export default UpdateProfile;
