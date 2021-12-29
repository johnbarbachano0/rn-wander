import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import MainCamera from "../../components/MainCamera";
import MainLocation from "../../components/MainLocation";
import MainMap from "../../components/MainMap";

const PlaceDetails = () => {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {/* <MainCamera />
      <MainLocation /> */}
      <MainMap />
    </ScrollView>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
