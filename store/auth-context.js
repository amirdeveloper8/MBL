import React, { useState } from "react";

import Cookies from "js-cookie";

const AuthContext = React.createContext({
  token: "",
  username: "",
  prefix: "",
  firstName: "",
  lastName: "",
  middleName: "",
  mobileNumber: "",
  telephoneNumber: "",
  email: "",
  shipAddress: "",
  address2: "",
  locality: "",
  state: "",
  postCode: "",
  country: "",
  imageSrc: "",
  businessName: "",
  businessPhone: "",
  businessMobile: "",
  businessEmail: "",
  businessId: "",
  sendUserData: false,
  sendAddressData: false,
  isLoggedIn: false,
  step1Done: false,
  login: (token, username) => {},
  logout: () => {},
  userDetails: (
    prefix,
    firstname,
    lastname,
    middlename,
    mobile,
    telephone,
    email
  ) => {},
  addressDetails: (
    shipAddress,
    address2,
    locality,
    state,
    postCode,
    country
  ) => {},
  businessProfileHandler: (
    businessId,
    businessName,
    businessMobile,
    businessPhone,
    businessEmail
  ) => {},
  resetPrefix: () => {},
  resetFname: () => {},
  resetLname: () => {},
  resetMname: () => {},
  resetMobile: () => {},
  resetTelephone: () => {},
  resetEmail: () => {},
  resetShipAddress: () => {},
  resetAddress2: () => {},
  resetLocality: () => {},
  resetState: () => {},
  resetPostCode: () => {},
  resetCountry: () => {},
  showUpdateProfile: () => {},
  closeUpdateProfile: () => {},
  showUpdateAddress: () => {},
  closeUpdateAddress: () => {},
  addImage: (img) => {},
  resetBusinessName: () => {},
  resetBusinessMobile: () => {},
  resetBusinessPhone: () => {},
  resetBusinessEmail: () => {},
  closeBusinessProfile: () => {},
});

export const AuthContextProvider = (props) => {
  /* login */
  const cookieToken = Cookies.get("token");
  const cookieUser = Cookies.get("username");
  const [token, setToken] = useState(cookieToken);
  const [username, setUsername] = useState(cookieUser);

  /* profile */

  const [prefix, setPrefix] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setmiddleName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [shipAddress, setShipAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [locality, setLocality] = useState("");
  const [state, setState] = useState("");
  const [postCode, setPostCode] = useState("");
  const [country, setCountry] = useState("");
  const [sendUserData, setSendUserData] = useState(false);
  const [sendAddressData, setSendAddressData] = useState(false);

  const [imageSrc, setImageSrc] = useState("");

  /* business */

  const [businessId, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessMobile, setBusinessMobile] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [step1Done, setStep1Done] = useState(false);

  const userIsLoggedIn = !!token;

  const loginHandler = (token, username) => {
    setToken(token);
    setUsername(username);
    Cookies.set("token", token);
    Cookies.set("username", username);
  };

  const logoutHandler = () => {
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("username");
    setFirstName("");
    setLastName("");
    setmiddleName("");
    setMobileNumber("");
    setTelephoneNumber("");
    setEmail("");
    setShipAddress("");
    setAddress2("");
    setLocality("");
    setState("");
    setPostCode("");
    setCountry("");
  };

  /* profile */

  const updateHandler = (
    prefix,
    firstname,
    lastname,
    middlename,
    mobile,
    telephone,
    email
  ) => {
    setPrefix(prefix);
    setFirstName(firstname);
    setLastName(lastname);
    setmiddleName(middlename);
    setMobileNumber(mobile);
    setTelephoneNumber(telephone);
    setEmail(email);
  };

  const addressHandler = (
    shipAddress,
    address2,
    locality,
    state,
    postCode,
    country
  ) => {
    setShipAddress(shipAddress);
    setAddress2(address2);
    setLocality(locality);
    setState(state);
    setPostCode(postCode);
    setCountry(country);
  };

  const resetPrefix = () => {
    setPrefix("");
  };
  const resetFname = () => {
    setFirstName("");
  };
  const resetLname = () => {
    setLastName("");
  };
  const resetMname = () => {
    setmiddleName("");
  };
  const resetMobile = () => {
    setMobileNumber("");
  };
  const resetEmail = () => {
    setEmail("");
  };

  const resetShipAddress = () => {
    setShipAddress("");
  };
  const resetAddress2 = () => {
    setAddress2("");
  };
  const resetLocality = () => {
    setLocality("");
  };
  const resetState = () => {
    setState("");
  };
  const resetPostCode = () => {
    setPostCode("");
  };
  const resetCountry = () => {
    setCountry("");
  };

  const showUpdateProfile = () => {
    setSendUserData(true);
  };
  const closeUpdateProfile = () => {
    setSendUserData(false);
  };

  const showUpdateAddress = () => {
    setSendAddressData(true);
  };
  const closeUpdateAddress = () => {
    setSendAddressData(false);
  };

  const addImage = (img) => {
    setImageSrc(img);
  };

  /* business */

  const businessProfileHandler = (
    businessId,
    businessName,
    businessMobile,
    businessPhone,
    businessEmail
  ) => {
    setBusinessId(businessId);
    setBusinessName(businessName);
    setBusinessMobile(businessMobile);
    setBusinessPhone(businessPhone);
    setBusinessEmail(businessEmail);
  };

  const resetBusinessName = () => {
    setBusinessName("");
  };
  const resetBusinessMobile = () => {
    setBusinessMobile("");
  };
  const resetBusinessPhone = () => {
    setBusinessPhone("");
  };
  const resetBusinessEmail = () => {
    setBusinessEmail("");
  };

  const closeBusinessProfile = () => {
    setStep1Done(true);
  };

  const contextValue = {
    token: token,
    username: username,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    userDetails: updateHandler,
    addressDetails: addressHandler,
    resetPrefix,
    resetFname,
    resetLname,
    resetMname,
    resetMobile,
    resetEmail,
    resetShipAddress,
    resetAddress2,
    resetLocality,
    resetState,
    resetPostCode,
    resetCountry,
    showUpdateProfile,
    closeUpdateProfile,
    showUpdateAddress,
    closeUpdateAddress,
    addImage,
    businessProfileHandler,
    resetBusinessName,
    resetBusinessMobile,
    resetBusinessPhone,
    resetBusinessEmail,
    closeBusinessProfile,
    sendUserData,
    sendAddressData,
    prefix,
    firstName,
    lastName,
    middleName,
    mobileNumber,
    telephoneNumber,
    email,
    shipAddress,
    address2,
    locality,
    state,
    postCode,
    country,
    imageSrc,
    businessName,
    businessPhone,
    businessMobile,
    businessEmail,
    businessId,
    step1Done,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
