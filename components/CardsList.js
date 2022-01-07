import React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { isApple } from "../constants/isApple";

const CardsList = ({ myPlaces, onCardClick }) => {
  return myPlaces?.map((place) => (
    <TouchableWithoutFeedback
      key={place.id}
      onPress={() => onCardClick(place.id)}
    >
      <Card style={styles.card}>
        <Card.Cover
          source={{ uri: place.image }}
          resizeMode="stretch"
          style={{ height: 300 }}
        />
        <Card.Title
          title={place.title}
          subtitle={`@${place.address}`}
          left={(props) => <Avatar.Icon {...props} icon="map-marker" />}
        />
      </Card>
    </TouchableWithoutFeedback>
  ));
};

export default CardsList;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minWidth: isApple ? "95%" : "99%",
    maxWidth: "100%",
    marginTop: 10,
  },
});
