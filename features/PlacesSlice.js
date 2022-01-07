import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    places: [],
    sortValues: {
      column: "updatedAt",
      sortOrder: "DESC",
    },
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
      const { myPlaces } = action.payload;
      state.value.places = myPlaces;
    },
    setSortValues: (state, action) => {
      const { newSortValues } = action.payload;
      state.value.sortValues = newSortValues;
    },
  },
});

export const { setPlace, getPlaces, setSortValues } = PlacesSlice.actions;

export default PlacesSlice.reducer;
