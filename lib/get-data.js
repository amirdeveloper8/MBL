import Cookies from "js-cookie";
import { useContext } from "react";
import AuthContext from "../store/auth-context";
import { ConnectToDB } from "./connect-to-db";

export const getData = async (db) => {
  const login_token = Cookies.get("token");

  const headers = {
    Authorization: `Bearer ${login_token}`,
  };

  const connectDB = ConnectToDB(db);

  const res = await fetch(connectDB, {
    headers,
  });

  const data = await res.json();

  return data;
};
