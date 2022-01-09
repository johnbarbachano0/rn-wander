import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Caption,
  Divider,
  Paragraph,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { isApple } from "../../constants/isApple";
import {
  useDateConverter,
  useDateTimeConverter,
} from "../../components/customHooks";
import Color from "../../constants/Color";
import { deletePlace, fetchPlaces } from "../../helpers/db";
import { useIsFocused } from "@react-navigation/native";

const PlaceDetails = ({ navigation, route }) => {
  const { id } = route.params;
  const { places, sortValues } = useSelector((state) => state.places.value);
  var filterPlace = places?.filter((place) => place.id === id).pop();
  const [myPlace, setMyPlace] = useState(filterPlace);
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => fetchNewData());
    return () => unsubscribe;
  }, [isFocused, places]);

  const fetchNewData = () => {
    fetchPlaces(sortValues.column, sortValues.sortOrder).then((res) => {
      setMyPlace(res?.rows?._array.filter((place) => place.id === id).pop());
    });
  };

  const handleDelete = () => {
    deletePlace(id)
      .then((res) => navigation.goBack())
      .catch((error) => {
        Alert.alert("Error!", "There was an error deleting this place.", [
          { text: "Try Again", onPress: () => {} },
        ]);
      });
  };

  const handleConfirm = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this place?", [
      {
        text: "Yes",
        onPress: () => {
          handleDelete();
        },
      },
      {
        text: "No",
        onPress: () => {},
      },
    ]);
  };
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri: myPlace.image }}
            resizeMode="stretch"
            style={styles.cover}
          />
          <Card.Title
            title={myPlace.title}
            subtitle={`@${myPlace.address}`}
            left={(props) => <Avatar.Icon {...props} icon="map-marker" />}
          />
          <Divider />
          <Card.Content style={styles.cardContent}>
            <Caption style={styles.subheader}>Memory of this place</Caption>
            <Paragraph>{myPlace.description}</Paragraph>
          </Card.Content>
          <Divider />
          <Card.Content style={styles.cardContent}>
            <Caption style={styles.subheader}>Details</Caption>
            <Paragraph>
              You visited this place on{" "}
              {useDateConverter(JSON.parse(myPlace.visitAt))}.
            </Paragraph>
            <Paragraph>
              Recorded this memory on {useDateTimeConverter(myPlace.createdAt)}.
            </Paragraph>
            <Paragraph>
              Updated this memory on {useDateTimeConverter(myPlace.updatedAt)}.
            </Paragraph>
          </Card.Content>
          <Divider />
          <Card.Content style={styles.cardContent}>
            <Caption style={styles.subheader}>On the map</Caption>
            <Card.Cover
              source={{ uri: myPlace.locationUri }}
              resizeMode="cover"
              style={styles.map}
            />
            <Button
              labelStyle={styles.button}
              uppercase={false}
              onPress={() =>
                navigation.navigate("MapScreen", {
                  latitude: myPlace.lat,
                  longitude: myPlace.lon,
                })
              }
            >
              See on Map
            </Button>
          </Card.Content>
          <Divider />
          <Card.Actions style={{ justifyContent: "space-around" }}>
            <Button
              labelStyle={styles.button}
              onPress={() =>
                navigation.navigate("NewPlace", {
                  navPath: "PlaceDetails",
                  id: myPlace.id,
                })
              }
            >
              Edit
            </Button>
            <Button
              labelStyle={[styles.button, { color: Color.error.light }]}
              onPress={handleConfirm}
            >
              Delete
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  card: {
    width: "95%",
    minWidth: isApple ? "95%" : "97.5%",
    maxWidth: "100%",
    marginBottom: isApple ? 100 : 10,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 10,
  },
  cover: {
    width: "100%",
    height: 300,
    maxHeight: 300,
  },
  button: {
    paddingVertical: 10,
    width: "40%",
  },
});
