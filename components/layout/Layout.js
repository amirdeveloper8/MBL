import { Fragment, useContext } from "react";
import AuthContext from "../../store/auth-context";

import MainNavigation from "./MainNavigation";
import SideBar from "./SideBar";

function Layout(props) {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  return (
    <Fragment>
      <MainNavigation />
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
