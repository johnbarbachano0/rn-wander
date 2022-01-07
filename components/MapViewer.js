import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapViewer = ({ route }) => {
  const { latitude, longitude } = route.params;
  const [initRegion, setInitRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleRegionChange = (e) => {
    setInitRegion(e);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initRegion}
        onRegionChange={(e) => handleRegionChange(e)}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    </View>
  );
};

export default MapViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    position: "absolute",
    bottom: 60,
  },
  button: {
    width: "45%",
    margin: 10,
  },
  buttonText: {
    paddingVertical: 5,
    fontSize: 18,
  },
});
