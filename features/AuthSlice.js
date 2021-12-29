import { createSlice } from "@reduxjs/toolkit";
import { addMinutes } from "../components/customHooks";
import { saveToLocal } from "../components/customHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  value: {
    authData: {
      idToken: "",
      email: "",
      expiresIn: 0,
      localId: "",
      refreshToken: "",
    },
  },
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { authData, page } = action.payload;
      const newAuthData =
        page === "Login"
          ? {
              ...authData,
              loginDate: new Date(Date.now()).toISOString(),
              expiryDate: addMinutes(new Date(Date.now()), 1).toISOString(),
            }
          : authData;
      // saveToLocal("authData", newAuthData);
      state.value.authData = newAuthData;
    },
    setLogout: (state, action) => {
      // AsyncStorage.removeItem("authData");
      state.value.authData = initialState.value.authData;
    },
  },
});

export const { setAuthData, setLogout } = AuthSlice.actions;

export default AuthSlice.reducer;
