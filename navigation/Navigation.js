import React, { useState, useEffect } from "react";
import DrawerNav from "./DrawerNav";
import AuthStackNav from "./AuthStackNav";
import { useSelector } from "react-redux";
import { getLocalData } from "../components/customHooks";

const Navigation = (props) => {
  const { loggedIn } = useSelector((state) => state.auth.value.authData);
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);

  useEffect(() => {
    const subscribe = getLocalData("authData").then((res) => {
      if (res.loggedIn === 1) {
        setIsLoggedIn(1);
      } else {
        setIsLoggedIn(0);
      }
    });
    return subscribe;
  }, [loggedIn]);

  return isLoggedIn === 1 ? <DrawerNav /> : <AuthStackNav />;
};

export default Navigation;
