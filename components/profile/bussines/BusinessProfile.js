import classes from "../login.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../../ui/notification";
import axios from "axios";

const isEmail = (value) => value.includes("@");
const isText = (value) => value.trim().length > 0;
const isMobile = (value) => value.trim().length === 11;

const BusinessProfile = () => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

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
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
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
    hasError: telephoneNumberHasError,
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

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  let formIsValid = false;

  if (
    (nameIsValid || authCtx.businessName !== "") &&
    (emailIsValid || authCtx.businessEmail !== "") &&
    (telephoneNumberIsValid || authCtx.businessPhone !== "") &&
    (mobileNumberIsValid || authCtx.businessMobile !== "")
  ) {
    formIsValid = true;
  }

  const connectDB = ConnectToDB("business/account/store");

  // async function createUser(name, mobile, telephone, email) {
  //   const headers = {
  //     "Content-type": "application/json",
  //     Authorization: `Bearer ${login_token}`,
  //   };
  //   const response = await fetch(connectDB, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       name,
  //       mobile,
  //       telephone,
  //       email,
  //     }),
  //     credentials: "include",
  //     headers: headers,
  //   });

  //   const data = await response.json();

  //   if (!response.ok) {
  //     // throw new Error(data.message || "Something went wrong!");
  //     setdataError(data.user);
  //   }

  //   return data;
  // }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    // try {
    //   const result = await createUser(
    //     authCtx.businessName || nameValue,
    //     authCtx.businessMobile || mobileNumberValue,
    //     authCtx.businessPhone || telephoneNumberValue,
    //     authCtx.businessEmail || emailValue
    //   );
    //   console.log(result);
    //   setNotification(result.status);
    //   if (result.status === "success") {
    //     console.log(
    //       result.account.id,
    //       result.account.name,
    //       result.account.mobile,
    //       result.account.telephone,
    //       result.account.email
    //     );
    //     authCtx.businessProfileHandler(
    //       result.account.id,
    //       result.account.name,
    //       result.account.mobile,
    //       result.account.telephone,
    //       result.account.email
    //     );
    //   }
    // } catch (error) {
    //   console.log("error", error);
    // }

    const connectDB = ConnectToDB("business/account/store");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("name", authCtx.businessName || nameValue);
    fData.append("mobile", authCtx.businessMobile || mobileNumberValue);
    fData.append("telephone", authCtx.businessPhone || telephoneNumberValue);
    fData.append("email", authCtx.businessEmail || emailValue);
    fData.append("image", selectedFile);
    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res.data);
        if (res.data.status === "success") {
          console.log(res.data);
          setNotification(res.data.status);
          authCtx.businessProfileHandler(
            res.data.account.id,
            res.data.account.name,
            res.data.account.mobile,
            res.data.account.telephone,
            res.data.account.email
          );
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
    resetEmail();
    resetName();
    resetMobileNumber();
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
      <h1>Update Your Business Profile</h1>
      <Form onSubmit={submitHandler}>
        <Row className="mb-3" className={classes.control}>
          <Form.Group
            as={Col}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={
                !authCtx.businessName || authCtx.businessName === ""
                  ? nameValue
                  : authCtx.businessName
              }
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
            />

            {nameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {authCtx.businessName && authCtx.businessName !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetBusinessName}
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
                !authCtx.businessEmail || authCtx.businessEmail === ""
                  ? emailValue
                  : authCtx.businessEmail
              }
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            />

            {emailHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid email address.
              </Alert>
            )}
            {authCtx.businessEmail && authCtx.businessEmail !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetBusinessEmail}
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
                !authCtx.businessMobile || authCtx.businessMobile === ""
                  ? mobileNumberValue
                  : authCtx.businessMobile
              }
              onChange={mobileNumberChangeHandler}
              onBlur={mobileNumberBlurHandler}
            />
            {mobileNumberHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Phone Number.
              </Alert>
            )}
            {authCtx.businessMobile && authCtx.businessMobile !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetBusinessMobile}
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
                !authCtx.businessPhone || authCtx.businessPhone == ""
                  ? telephoneNumberValue
                  : authCtx.businessPhone
              }
              onChange={telephoneNumberChangeHandler}
              onBlur={telephoneNumberBlurHandler}
            />
            {authCtx.businessPhone && authCtx.businessPhone !== "" && (
              <Badge
                className={classes.edit}
                onClick={authCtx.resetBusinessPhone}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              name="image"
              id="image"
              type="file"
              onChange={(e) => handleChange(e.target.files)}
              size="sm"
            />
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

export default BusinessProfile;
