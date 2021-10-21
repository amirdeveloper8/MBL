import classes from "./signup.module.css";
import Link from "next/link";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useState, useEffect } from "react";
import Notification from "../../ui/notification";
import Modal from "../../ui/Modal";
import { Alert, Badge, CloseButton } from "react-bootstrap";

import { MdDoneOutline } from "react-icons/md";

const isEmail = (value) => value.includes("@");
const isPass = (value) => value.trim().length > 5;

const SignupWithEmail = () => {
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(isEmail);

  const {
    value: passValue,
    isValid: passIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
    reset: resetPass,
  } = useInput(isPass);

  const {
    value: confirmPassValue,
    valueChangeHandler: confirmPassChangeHandler,
    inputBlurHandler: confirmPassBlurHandler,
    reset: resetConfirmPass,
  } = useInput(isPass);

  const [confPassError, setconfPassError] = useState(false);
  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (notification === "success") {
      const timer = setTimeout(() => {
        setModal(true);
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (notification === "success" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setdataError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  let formIsValid = false;

  if (emailIsValid && passIsValid) {
    formIsValid = true;
  }

  const connectDB = ConnectToDB("auth/register/user/email");

  async function createUser(email, password, password_confirmation) {
    const response = await fetch(connectDB, {
      method: "POST",
      body: JSON.stringify({ email, password, password_confirmation }),
      headers: {
        "Content-type": "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // throw new Error(data.message || "Something went wrong!");
      setdataError(data.msg);
    }

    return data;
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    setNotification("pending");

    try {
      const result = await createUser(emailValue, passValue, confirmPassValue);
      console.log(result);
      if (result.user) {
        setNotification("success");
      } else {
        setNotification("error");
      }
    } catch (error) {
      console.log("error", error);
      return;
    }

    resetEmail();
    resetPass();
    resetConfirmPass();
    setconfPassError(false);
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
      <h1>Sign up with Email</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            required
            value={emailValue}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {emailHasError && (
            <p className={classes.errorText}>
              Please enter a valid email address.
            </p>
          )}
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            value={passValue}
            onChange={passChangeHandler}
            onBlur={passBlurHandler}
          />

          {passHasError && (
            <p className={classes.errorText}>
              Password must be at least 6 character.
            </p>
          )}
        </div>
        <div className={classes.control}>
          <MdDoneOutline className={classes.iconDone} />
          <label htmlFor="password_confirmation">Confirm Your Password</label>
          <input
            type="password"
            id="password_confirmation"
            required
            value={confirmPassValue}
            onChange={confirmPassChangeHandler}
            onBlur={confirmPassBlurHandler}
          />
          {confPassError && (
            <p className={classes.errorText}>Please check Again!</p>
          )}
        </div>
        <div className={classes.actions}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Sign up
          </button>
          <button type="button" className={classes.toggle}>
            <Link href="/auth/signup" className={classes.newAccount}>
              Create new account
            </Link>
          </button>
        </div>
      </form>

      {modal && (
        <Modal>
          <Alert variant="success">
            <Alert.Heading>Please Check Your Email!</Alert.Heading>
          </Alert>
          <CloseButton
            className={classes.closeButton}
            onClick={() => {
              setModal(false);
            }}
          />
        </Modal>
      )}
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

export default SignupWithEmail;
