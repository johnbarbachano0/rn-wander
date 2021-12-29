import React, { useState, useEffect } from "react";
import DrawerNav from "./DrawerNav";
import AuthStackNav from "./AuthStackNav";
import { useSelector, useDispatch } from "react-redux";
import { getLocalData } from "../components/customHooks";

const Navigation = (props) => {
  const { idToken } = useSelector((state) => state.auth.value.authData);
  const [auth, setAuth] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const subscribe = getLocalData("authData").then((res) => {
      if (res) {
        setAuth(res);
        auth === null && dispatch(setAuthData({ authData: res, page: "Nav" }));
      } else if (res === null) {
        setAuth(null);
      }
    });
    return subscribe;
  }, [idToken]);

  return auth === null || idToken === "" ? <DrawerNav /> : <AuthStackNav />;
};

export default Navigation;
