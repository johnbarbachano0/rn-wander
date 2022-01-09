import { createSlice } from "@reduxjs/toolkit";
import { saveToLocal } from "../components/customHooks";

const initialState = {
  value: {
    authData: {
      loggedIn: false,
    },
  },
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const newAuthData = { loggedIn: action.payload };
      saveToLocal("authData", newAuthData);
      state.value.authData = newAuthData;
    },
    setLogout: (state, action) => {
      const newAuthData = { loggedIn: false };
      saveToLocal("authData", newAuthData);
      state.value.authData = newAuthData;
    },
  },
});

export const { setAuthData, setLogout } = AuthSlice.actions;

export default AuthSlice.reducer;
