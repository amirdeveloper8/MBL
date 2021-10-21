import Link from "next/link";
import classes from "./sidebar.module.css";

const SideBar = () => {
  return (
    <section className={classes.sidebar}>
      <nav>
        <div>
          <Link href="/profile">Profile</Link>
        </div>
        <div>
          <Link href="/profile/info">Info</Link>
        </div>
        <div>
          <Link href="/profile/business-account">Bussines</Link>
        </div>
      </nav>
    </section>
  );
};

export default SideBar;
