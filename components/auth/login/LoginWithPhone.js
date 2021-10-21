import classes from "./login.module.css";
import Link from "next/link";

const LoginWithPhone = () => {
  return (
    <section className={classes.auth}>
      <h1>Login with Phone Number</h1>
      <form>
        <div className={classes.control}>
          <label htmlFor="phone-number">Your Phone Number</label>
          <input type="number" id="phone-number" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          <button>Login</button>
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

export default LoginWithPhone;
