import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, useColorScheme } from "react-native";
import * as Location from "expo-location";
import { Button, Card, DataTable } from "react-native-paper";
import { useMapPath } from "./customHooks";

export default function App({ onLocation }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const style = colorScheme === "dark" ? "dark-v10" : "streets-v11";

  const getLocation = async () => {
    setLoading(true);
    var { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    try {
      var loc = await Location.getCurrentPositionAsync();
      setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      onLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      setLoading(false);
    } catch (error) {
      Alert.alert("Error!", "Error in getting your current location.", [
        { text: "Try Again", onPress: () => {} },
      ]);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {location === null ? (
        <Card style={styles.card}>
          <Text style={styles.text}>Location not set</Text>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Cover
            source={{
              uri: useMapPath(location.lat, location.lon, "10", "71DFE7", style)
                .path,
            }}
            style={styles.image}
          />
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.tableAlign}>
                Latitude
              </DataTable.Title>
              <DataTable.Title style={styles.tableAlign}>
                Longitude
              </DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
              <DataTable.Cell style={styles.tableAlign} numberOfLines={1}>
                {location.lat}
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableAlign} numberOfLines={1}>
                {location.lon}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card>
      )}

      <Button
        onPress={getLocation}
        loading={loading}
        disabled={loading}
        labelStyle={styles.button}
      >
        Set to Current Location
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  location: {
    fontSize: 18,
    textAlign: "center",
  },
  text: { color: "#888", fontSize: 18, padding: 20, textAlign: "center" },
  card: { width: "100%" },
  image: { width: "100%", height: 300 },
  button: { padding: 10 },
  table: { width: "100%" },
  tableAlign: {
    alignItems: "center",
    justifyContent: "center",
  },
});
