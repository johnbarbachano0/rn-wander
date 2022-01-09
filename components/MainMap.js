import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { Button, Paragraph } from "react-native-paper";
import Color from "../constants/Color";
import { isApple } from "../constants/isApple";

export default function MainMap({ setShowMap, onPickedLocation }) {
  const [permission, setPermission] = useState("undetermined");
  const [location, setLocation] = useState(null);
  const [initRegion, setInitRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapEl = useRef(null);

  useEffect(async () => {
    const subscribe = await getLocation();
    return () => subscribe;
  }, []);

  const getLocation = async () => {
    var { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermission(status);
      return;
    }
    try {
      var loc = await Location.getCurrentPositionAsync();
      const curr = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(curr);
      setInitRegion((prev) => {
        return { ...prev, ...curr };
      });
      setPermission("granted");
    } catch (error) {
      Alert.alert("Error!", "Error in getting your current location.", [
        { text: "Try Again", onPress: () => {} },
      ]);
    }
  };

  const handleMarkerDrag = (e) => {
    setLocation(e.nativeEvent.coordinate);
  };

  const handleMapPress = (e) => {
    setLocation(e.nativeEvent.coordinate);
  };

  const handleRegionChange = (e) => {
    setInitRegion(e);
  };

  const handleChoose = () => {
    setShowMap(false);
    const snapshot = mapEl.current.takeSnapshot({
      height: 300,
      region: { initRegion },
    });
    snapshot.then((uri) => {
      onPickedLocation(location, uri);
    });
  };

  if (permission === "undetermined") {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} color={Color.primary.light} />
        <Paragraph>Loading...</Paragraph>
      </View>
    );
  }

  if (permission === "denied") {
    return (
      <View style={styles.container}>
        <Paragraph>Need permission to access map.</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initRegion}
        onRegionChange={(e) => handleRegionChange(e)}
        onPress={(e) => handleMapPress(e)}
        ref={mapEl}
      >
        <Marker
          draggable
          coordinate={location}
          onDragEnd={(e) => handleMarkerDrag(e)}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleChoose}
          style={styles.button}
          labelStyle={styles.buttonText}
          compact
        >
          Select
        </Button>
        <Button
          mode="contained"
          onPress={() => setShowMap(false)}
          style={styles.button}
          labelStyle={styles.buttonText}
          color={Color.nuetral.dark}
          compact
        >
          Cancel
        </Button>
      </View>
    </View>
  );
}

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
    bottom: isApple ? 60 : 20,
  },
  button: {
    width: "35%",
    margin: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    paddingVertical: 5,
    fontSize: 16,
  },
});
