import SignupWithPhone from "./SignupWithPhone";
import SignupWithEmail from "./SignupWithEmail";
import SignupWithGoogle from "./SignupWithGoogle";
import { useState } from "react";

import classes from "./all-signup.module.css";
const AllSignUp = () => {
  const [loginByEmail, setLoginByEmail] = useState(true);

  const logEmail = (event) => {
    event.preventDefault();

    setLoginByEmail(true);
  };

  const logPhone = (event) => {
    event.preventDefault();

    setLoginByEmail(false);
  };

  const emailClasses = loginByEmail
    ? `${classes.active}`
    : `${classes.deactive}`;

  const phonelClasses = !loginByEmail
    ? `${classes.active}`
    : `${classes.deactive}`;

  return (
    <section className={classes.auth}>
      <SignupWithGoogle />
      <div className={classes.login}>
        <h3>Sign up with:</h3>
        <div className={classes.logActions}>
          <button className={emailClasses} type="button" onClick={logEmail}>
            Email
          </button>

          <button className={phonelClasses} type="button" onClick={logPhone}>
            Phone
          </button>
        </div>
        {!loginByEmail && <SignupWithPhone />}
        {loginByEmail && <SignupWithEmail />}
      </div>
    </section>
  );
};

export default AllSignUp;
