import LoginWithPhone from "./LoginWithPhone";
import LoginWithEmail from "./LoginWithEmail";

import classes from "./all-login.module.css";
import { useState } from "react";
const AllLogins = () => {
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
      <div className={classes.google}>
        <button>Login with Google</button>
      </div>
      <div className={classes.login}>
      <h3>Login with:</h3>
        <div className={classes.logActions}>
          <button className={emailClasses} type="button" onClick={logEmail}>
            Email
          </button>

          <button className={phonelClasses} type="button" onClick={logPhone}>
            Phone
          </button>
        </div>
        {!loginByEmail && <LoginWithPhone />}
        {loginByEmail && <LoginWithEmail />}
      </div>
    </section>
  );
};

export default AllLogins;
