import { Fragment } from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <Fragment>
      <h1>My Booking Log</h1>
      <Link href="/auth/login">My Booking Log</Link>
    </Fragment>
  );
};

export default HomePage;
