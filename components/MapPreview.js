import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, DataTable } from "react-native-paper";

const MapPreview = ({ value, locationUri }) => {
  return (
    <View style={styles.container}>
      {value === undefined || value === null ? (
        <Card style={styles.card}>
          <Text style={styles.text}>No location selected</Text>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Cover
            source={{
              uri: locationUri,
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
                {value?.latitude}
              </DataTable.Cell>
              <DataTable.Cell style={styles.tableAlign} numberOfLines={1}>
                {value?.longitude}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card>
      )}
    </View>
  );
};

export default MapPreview;

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
