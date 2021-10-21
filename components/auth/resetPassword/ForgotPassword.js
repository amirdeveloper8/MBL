import classes from "./forgotpassword.module.css";
import Link from "next/link";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useState, useEffect } from "react";
import Notification from "../../ui/notification";

const isEmail = (value) => value.includes("@");

const ForgotPassword = () => {
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(isEmail);

  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();
  const [messageSent, setMessageSent] = useState(false);

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

  if (emailIsValid) {
    formIsValid = true;
  }

  const connectDB = ConnectToDB("api/resetPassword ");

  async function createUser(email) {
    const response = await fetch(connectDB, {
      method: "POST",
      body: JSON.stringify({ email }),
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
      const result = await createUser(emailValue);
      console.log(result);
      if (result.status === "success") {
        setNotification("success");
        setMessageSent(true);
      } else {
        setNotification("error");
      }
    } catch (error) {
      console.log("error", error);
      return;
    }

    resetEmail();
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

  if (messageSent) {
    return (
      <section className={classes.auth}>
        <h1>Reset Password link sent to you!</h1>
        <p>Please Check youe Email</p>
      </section>
    );
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
        <div className={classes.actions}>
          <button>Send</button>
          <button type="button" className={classes.toggle}>
            <Link href="/auth/signup" className={classes.newAccount}>
              Create new account
            </Link>
          </button>
        </div>
      </form>
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

export default ForgotPassword;
