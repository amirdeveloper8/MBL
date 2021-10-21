import classes from "./signup.module.css";
import Link from "next/link";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useState } from "react";

const isPhone = (value) => value.trim().length === 11;
const isPass = (value) => value.trim().length > 5;

const SignupWithEmail = () => {
  const {
    value: phoneValue,
    isValid: phoneIsValid,
    hasError: phoneHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    reset: resetPhone,
  } = useInput(isPhone);

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

  let formIsValid = false;

  if (phoneIsValid && passIsValid) {
    formIsValid = true;
  }

  async function createUser(email, password, password_confirmation) {
    const connectDB =
      "http://192.168.7.19/nmbl/public/auth/register/user/email";
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
      throw new Error(data.message || "Something went wrong!");
    }

    return data;
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const result = await createUser(emailValue, passValue, confirmPassValue);
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    resetPhone();
    resetPass();
    resetConfirmPass();
    setconfPassError(false);
  };
  return (
    <section className={classes.auth}>
      <h1>Sign up with Phone Number</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="phone">Your Phone Number</label>
          <input
            type="number"
            id="phone"
            required
            value={phoneValue}
            onChange={phoneChangeHandler}
            onBlur={phoneBlurHandler}
          />
          {phoneHasError && (
            <p className={classes.errorText}>
              Please enter a valid phone number.
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
          <button>Sign up</button>
          <button type="button" className={classes.toggle}>
            <Link href="/auth/signup" className={classes.newAccount}>
              Create new account
            </Link>
          </button>
        </div>
      </form>
    </section>
  );
};

export default SignupWithEmail;
