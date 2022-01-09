import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { fetchPlaces } from "../../helpers/db";
import { Button, Card, Paragraph } from "react-native-paper";
import { isApple } from "../../constants/isApple";

const Explore = ({ navigation }) => {
  const { places, sortValues } = useSelector((state) => state.places.value);
  const [myPlaces, setMyPlaces] = useState(places);
  const region = {
    latitude: myPlaces[0]?.lat || 37.78825,
    longitude: myPlaces[0]?.lon || -122.4324,
    latitudeDelta: 3,
    longitudeDelta: 3,
  };
  const [initRegion, setInitRegion] = useState(region);
  const isFocused = useIsFocused();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => fetchNewData());
    return () => unsubscribe;
  }, [isFocused]);

  const fetchNewData = () => {
    fetchPlaces(sortValues.column, sortValues.sortOrder)
      .then((res) => {
        const arrObj = res?.rows?._array;
        if (arrObj.length > 0) {
          setMyPlaces(arrObj);
          setInitRegion((prev) => {
            return {
              ...prev,
              latitude: arrObj[0]?.lat,
              longitude: arrObj[0]?.lon,
            };
          });
        } else {
          setMyPlaces([]);
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error!", "Error in getting data from database.", [
          {
            text: "Try Again",
            onPress: () => {
              fetchNewData();
            },
          },
        ]);
      });
  };

  const handleRegionChange = (e) => {
    setInitRegion(e);
  };

  if (myPlaces.length === 0) {
    return (
      <View style={styles.screen}>
        <Card style={styles.card}>
          <Paragraph style={styles.text}>
            There are no places to explore yet .
          </Paragraph>
          <Paragraph style={styles.text}>
            Go to Home and add a new Place.
          </Paragraph>
          <Button onPress={() => navigation.navigate("Home")}>
            Back to Home
          </Button>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <MapView
        style={styles.map}
        initialRegion={initRegion}
        onRegionChange={(e) => handleRegionChange(e)}
      >
        {myPlaces.map((place) => (
          <Marker
            key={place.id}
            title={place.title}
            coordinate={{
              latitude: place.lat,
              longitude: place.lon,
            }}
          />
        ))}
      </MapView>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  card: {
    width: "95%",
    minWidth: isApple ? "95%" : "99%",
    maxWidth: "100%",
    marginTop: 10,
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});
