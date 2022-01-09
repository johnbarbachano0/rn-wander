import React, { useState, useEffect } from "react";
import DrawerNav from "./DrawerNav";
import AuthStackNav from "./AuthStackNav";
import { useSelector } from "react-redux";

const Navigation = () => {
  const { loggedIn } = useSelector((state) => state.auth.value.authData);

  return loggedIn ? <DrawerNav /> : <AuthStackNav />;
};

export default Navigation;
