import { Alert } from "react-native";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import vars from "../env";

export const useCapitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const useRemoveSpace = (value) => {
  return value.replace(/\s/g, "");
};

export const useIsoDate = (date) => {
  var converted = date;
  if (date.length === 0) {
    converted = new Date(Date.now()).toISOString();
  } else {
    converted = new Date(Date.now(date)).toISOString();
  }
  return converted;
};

export const useDateTimeConverter = (ISOdate) => {
  const dateFormat = new Date(ISOdate).toLocaleDateString();
  const timeFormat = new Date(ISOdate).toLocaleTimeString();
  return dateFormat + " " + timeFormat;
};

export const useDateConverter = (ISOdate) => {
  const dateFormat = new Date(ISOdate).toLocaleDateString();
  return dateFormat;
};

export const useAddMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

// export const getLoginImage = () => {
//   const x = Math.floor(Math.random() * 3 + 1);
//   const image = require(`../assets/backgrounds/${x}.jpg`);
//   return image.default;
// };

// export const getImagePath = () => {
//   const x = Math.floor(Math.random() * 3 + 1);
//   const imagePath = `../../assets/backgrounds/${x}.jpg`;
//   return imagePath;
// };

export const useRandomNumber = (limit) => {
  return Math.floor(Math.random() * limit + 1);
};

export const saveToLocal = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Alert.alert("Error!", `Failed to save to local storage.`, [
    //   {
    //     text: "OK",
    //     onPress: () => {},
    //   },
    // ]);
  }
};

export const getLocalData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return null;
    }
  } catch (error) {
    // Alert.alert("Error!", "Failed to read local storage.", [
    //   {
    //     text: "OK",
    //     onPress: () => {},
    //   },
    // ]);
  }
};

export const removeLocalData = async (key) => {
  try {
    await AsyncStorage.removeItem("key");
  } catch (error) {
    console.log(error);
  }
};

export const usePlatform = () => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const isPortrait = useMemo(
    () => windowHeight > windowWidth,
    [windowHeight, windowWidth]
  );

  return { isPortrait, windowHeight, windowWidth };
};

export const useMapPath = (lat, lon, zoom, color, style) => {
  const path = `https://api.mapbox.com/styles/v1/mapbox/${style}/static/pin-s+${color}(${lon},${lat})/${lon},${lat},${zoom}/300x300@2x?access_token=${vars.mapboxApiKey}`;
  return { path };
};
