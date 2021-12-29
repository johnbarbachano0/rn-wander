import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    places: [],
    fetchedData: [],
  },
};

export const PlacesSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    setPlace: (state, action) => {
      const { newPlace } = action.payload;
      const { places } = state.value;
      state.value.places = [...places, newPlace];
    },
    getPlaces: (state, action) => {
      const { fetched } = action.payload;
      state.value.places = fetched;
    },
  },
});

export const { setPlace, getPlaces } = PlacesSlice.actions;

export default PlacesSlice.reducer;
