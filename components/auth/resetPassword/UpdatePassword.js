import classes from "./forgotpassword.module.css";
import Link from "next/link";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useState, useEffect } from "react";
import Notification from "../../ui/notification";

const isPass = (value) => value.trim().length > 5;

const UpdatePassword = (props) => {
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

  const userId = props.userId;
  const userToken = props.userToken;

  const [confPassError, setConfPassError] = useState(false);
  const [notification, setNotification] = useState();
  const [dataError, setDataError] = useState();
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    if (notification === "success" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setDataError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  let formIsValid = false;

  if (passIsValid) {
    formIsValid = true;
  }

  const connectDB = ConnectToDB("api/updatePassword");

  async function createUser(id, token, password, password_confirmation) {
    const response = await fetch(connectDB, {
      method: "POST",
      body: JSON.stringify({ id, token, password, password_confirmation }),
      headers: {
        "Content-type": "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // throw new Error(data.message || "Something went wrong!");
      setDataError(data.msg);
    }

    return data;
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    setNotification("pending");

    try {
      const result = await createUser(
        userId,
        userToken,
        passValue,
        confirmPassValue
      );
      console.log(result);
      console.log(result.status);
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

    resetPass();
    resetConfirmPass();
    setConfPassError(false);
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
      message: "your password has been changes!",
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
        <h1>Your Password Updated!</h1>
        <Link href="/auth/login">Login</Link>
      </section>
    );
  }
  return (
    <section className={classes.auth}>
      <h1>Update Your Password</h1>
      <form onSubmit={submitHandler}>
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
          <button>Submit</button>
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

export default UpdatePassword;
