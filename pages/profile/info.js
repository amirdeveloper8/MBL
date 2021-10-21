import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { useRouter } from "next/router";
import { ConnectToDB } from "../../lib/connect-to-db";
import UpdateProfile from "../../components/profile/UpdateProfile";
import Button from "../../components/ui/Button";
import AddressProfile from "../../components/profile/AddressProfile";
import UpdateAddress from "../../components/profile/UpdateAddress";
import UpdateImage from "../../components/profile/UpdateImage";

import classes from "../../styles/update-profile.module.css";

const API_URL = "http://192.168.7.19/nmbl/public/";

const ProfileInfo = () => {
  const [details, setDetails] = useState(null);
  const router = useRouter();

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const login_token = authCtx.token;
  const ToggleUpdateProfile = authCtx.ToggleUpdateProfile;

  const getData = async () => {
    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const connectDB = ConnectToDB("auth/user");

    const res = await fetch(connectDB, {
      headers,
    });

    const data = await res.json();

    const user = data.user;

    setDetails(user);
    authCtx.userDetails(
      user.prefix,
      user.firstname,
      user.lastname,
      user.middlename,
      user.mobile,
      user.telephone,
      user.email
    );
    if (user.address) {
      authCtx.addressDetails(
        user.address.shipaddress,
        user.address.address2,
        user.address.locality,
        user.address.state,
        user.address.postcode,
        user.address.country
      );
    }

    if (user.photo) {
      authCtx.addImage(user.photo_url);
    }
    console.log(user);
  };
  useEffect(async () => {
    if (!isLoggedIn) {
      router.replace("/auth/login");
    } else {
      await getData();
    }
  }, []);

  const showNotification = async () => {
    await getData();
  };

  const hideNotification = () => {
    setDetails(null);
  };

  return (
    <div className={classes.information}>
      <h1>Profile Information</h1>
      {!details && <button onClick={showNotification}>Show Information</button>}
      {details && <button onClick={hideNotification}>Hide Information</button>}
      {details && (
        <div>
          <ul>
            <li>Prefix: {authCtx.prefix}</li>
            <li>First Name:{authCtx.firstName}</li>
            <li>Last Name:{authCtx.lastName}</li>
            <li>middle Name:{authCtx.middleName}</li>
            <li>Mobile Number:{authCtx.mobileNumber}</li>
            <li>Telephone Number:{authCtx.telephoneNumber}</li>
            <li>Email:{authCtx.email}</li>
            <li>Address:{authCtx.shipAddress}</li>
            <li>Address2:{authCtx.address2}</li>
            <li>City:{authCtx.locality}</li>
            <li>State:{authCtx.state}</li>
            <li>Postal Code:{authCtx.postCode}</li>
            <li>Country:{authCtx.country}</li>
          </ul>
        </div>
      )}
      <Button onClick={authCtx.showUpdateProfile}>
        Send or Edit your Information
      </Button>
      <Button onClick={authCtx.showUpdateAddress}>
        Send or Edit your Adress
      </Button>
      {authCtx.sendUserData && <UpdateProfile />}
      {/* {authCtx.sendAddressData && <AddressProfile />} */}
      {authCtx.sendAddressData && <UpdateAddress />}
      <div className={classes.profileImage}>
        <UpdateImage />
      </div>
    </div>
  );
};

export default ProfileInfo;
