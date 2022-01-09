import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/AuthSlice";
import placesReducer from "../features/PlacesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    places: placesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
