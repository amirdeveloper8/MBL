import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import { ConnectToDB } from "../../../lib/connect-to-db";

import Button from "../../../components/ui/Button";

import classes from "../../../styles/bussines-account.module.css";
import BusinessProfile from "../../../components/profile/bussines/BusinessProfile";
import BusinessAddress from "../../../components/profile/bussines/BusinessAddress";

const CreateAccount = () => {
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
  };

  useEffect(async () => {
    if (!isLoggedIn) {
      router.replace("/auth/login");
    } else {
      await getData();
    }
  }, []);

  const Name = authCtx.businessName;
  const Email = authCtx.businessEmail;
  const Mobile = authCtx.businessMobile;
  const Phone = authCtx.businessPhone;
  const Id = authCtx.businessId;

  return (
    <section className={classes.bussinesaccount}>
      <div>
        <ul>
          <li>{Name}</li>
          <li>{Email}</li>
          <li>{Mobile}</li>
          <li>{Phone}</li>
          <li>{Id}</li>
        </ul>
      </div>
      {!step1Done && <BusinessProfile />}
      <BusinessAddress />
    </section>
  );
};

export default CreateAccount;
