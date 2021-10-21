import classes from "./login.module.css";
import Link from "next/link";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../../ui/notification";
import Modal from "../../ui/Modal";

const isEmail = (value) => value.includes("@");
const isPass = (value) => value.trim().length > 5;

const LoginWithEmail = () => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (notification === "success" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setdataError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  let formIsValid = false;

  if (emailIsValid && passIsValid) {
    formIsValid = true;
  }

  const connectDB = ConnectToDB("auth/login/email");

  async function createUser(email, password) {
    const response = await fetch(connectDB, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
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
      const result = await createUser(emailValue, passValue);
      if (result.token) {
        console.log("You Signed In");
        console.log(result);
        authCtx.login(result.token, result.user.email);
        router.replace("/profile");
        setNotification("success");
      } else {
        console.log(result);
        setNotification("error");
      }
    } catch (error) {
      console.log("error", error);
    }

    resetEmail();
    resetPass();
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
          <Link href="/auth/resetpassword">Forgot Password?</Link>
        </div>
        <div className={classes.actions}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Login
          </button>
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

export default LoginWithEmail;
