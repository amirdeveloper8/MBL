import NavLink from "../navlink/NavLink";
import Link from "next/link";
import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";

import classes from "./main-navigation.module.css";
import { useRouter } from "next/router";
import SideBar from "./SideBar";

import { CgMenuBoxed, CgCloseR } from "react-icons/cg";

const MainNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const router = useRouter();

  const logoutHandler = () => {
    authCtx.logout();

    router.push("/auth/login");
  };

  const menuHandler = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header>
      <section className={classes.header}>
        <Link href="/">
          <a>
            <div className={classes.logo}>Next Auth</div>
          </a>
        </Link>

        <nav>
          <ul>
            {!isLoggedIn && (
              <li>
                <NavLink href="/auth/login">Login</NavLink>
              </li>
            )}

            {!isLoggedIn && (
              <li>
                <NavLink href="/auth/register">Signup</NavLink>
              </li>
            )}

            {isLoggedIn && (
              <li>
                <NavLink href="/profile">Profile</NavLink>
              </li>
            )}

            {isLoggedIn && (
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            )}
          </ul>
        </nav>
      </section>
      <section className={classes.icons}>
        {!showMenu && isLoggedIn && (
          <CgMenuBoxed onClick={menuHandler} className={classes.burger} />
        )}
        {showMenu && isLoggedIn && (
          <CgCloseR onClick={menuHandler} className={classes.burger} />
        )}
      </section>

      {isLoggedIn && (
        <section className={classes.sidebar}>{showMenu && <SideBar />}</section>
      )}
    </header>
  );
};

export default MainNavigation;
