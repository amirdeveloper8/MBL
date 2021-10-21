import { ConnectToDB } from "../../../lib/connect-to-db";
import classes from "./signup-with-google.module.css";

const SignupWithGoogle = () => {
  const submitHandler = async (event) => {
    event.preventDefault();

    const connectDB = ConnectToDB("auth/login/google");

    const response = await fetch(connectDB);

    const data = response.json();

    console.log(data);
  };
  return (
    <div className={classes.google}>
      <button onClick={submitHandler}>Sign up with Google</button>
    </div>
  );
};

export default SignupWithGoogle;
