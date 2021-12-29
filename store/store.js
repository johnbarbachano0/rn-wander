import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/AuthSlice";
import { authApi } from "../services/AuthService";
import placesReducer from "../features/PlacesSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    places: placesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware),
});
