import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Cookies from "js-cookie";

const API_URL = "http://192.168.7.19/nmbl/public/";

const Profile = (props) => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  console.log(props.session);

  const isLoggedIn = authCtx.isLoggedIn;
  const user = Cookies.get("username");

  // useEffect(async () => {
  //   if (!isLoggedIn) {
  //     router.replace("/auth/login");
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [isLoggedIn]);

  // const user = authCtx.username;

  // if (loading) {
  //   return <div>loading ...</div>;
  // }

  return (
    <div className="center">
      <h1>Welcome {user}</h1>
      <Button>
        <Link href="/profile/info">Info</Link>
      </Button>
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const session = ctx.req.headers.cookie;

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Profile;
