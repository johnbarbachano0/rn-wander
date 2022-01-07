import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapViewer from "../../components/MapViewer";

const MapScreen = ({ route }) => {
  return (
    <View style={styles.screen}>
      <MapViewer route={route} />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
