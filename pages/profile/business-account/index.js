import { useContext, useEffect, useState } from "react";

import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import { ConnectToDB } from "../../../lib/connect-to-db";
import Link from "next/link";
import Image from "next/image";

import Button from "../../../components/ui/Button";

import classes from "../../../styles/bussines-account.module.css";
import BusinessProfile from "../../../components/profile/bussines/BusinessProfile";
import BusinessAddress from "../../../components/profile/bussines/BusinessAddress";

const API_URL = "http://192.168.7.19/nmbl/public/";

const BussinesAccount = () => {
  const [noAccount, setNoAccount] = useState(false);
  const [staffsBusiness, setStaffsBusiness] = useState([]);
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const router = useRouter();

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const login_token = authCtx.token;
  const ToggleUpdateProfile = authCtx.ToggleUpdateProfile;

  const step1Done = authCtx.step1Done;

  const getData = async () => {
    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const connectDB = ConnectToDB("business/account/index");

    const res = await fetch(connectDB, {
      headers,
    });

    console.log(login_token);

    const data = await res.json();

    // setDetails(user);
    // authCtx.userDetails(
    //   user.prefix,
    //   user.firstname,
    //   user.lastname,
    //   user.middlename,
    //   user.mobile,
    //   user.telephone,
    //   user.email
    // );
    // if (user.address) {
    //   authCtx.addressDetails(
    //     user.address.shipaddress,
    //     user.address.address2,
    //     user.address.locality,
    //     user.address.state,
    //     user.address.postcode,
    //     user.address.country
    //   );
    // }

    // if (user.photo) {
    //   authCtx.addImage(user.photo_url);
    // }
    console.log(data);
    // if (data.staffs.length === 0) {
    //   setNoAccount(true);
    // }
    setStaffsBusiness(data.staffs);
  };

  useEffect(async () => {
    if (!isLoggedIn) {
      router.replace("/auth/login");
    } else {
      await getData();
    }
  }, []);

  console.log(staffsBusiness);

  return (
    <section className={classes.bussinesaccount}>
      <div className={classes.createButton}>
        <Button>
          <Link href="/profile/business-account/create-account">
            Create new Account
          </Link>
        </Button>
      </div>
      <div className={classes.staffs}>
        {staffsBusiness.map((staff, index) => (
          <div key={staff.bussiness_accounts_id} className={classes.staff}>
            <div className={classes.imagebox}>
              <img src={staff.bussiness_accounts.photo_url} />
            </div>
            <h2>#{index + 1}</h2>
            <ul>
              <li>{staff.bussiness_accounts.id}</li>
              <li>{staff.bussiness_accounts.name}</li>
              <li>{staff.bussiness_accounts.email}</li>
              <li>{staff.bussiness_accounts.mobile}</li>
            </ul>
            <Button>
              <Link
                href={`/profile/business-account/${staff.bussiness_accounts.id}`}
              >
                Visit this account
              </Link>
            </Button>
          </div>
        ))}
      </div>

      {noAccount && (
        <div className={classes.dontaccount}>
          <p>you dont have bussines account</p>
          <Button>
            <Link href="/profile/business-account/create-account">
              Create new Account
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};

export default BussinesAccount;
