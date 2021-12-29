import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { getPlaces } from "../../features/PlacesSlice";
import { isApple } from "../../constants/isApple";
import { fetchPlaces } from "../../helpers/db";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const Home = ({ navigation, ...props }) => {
  const { places } = useSelector((state) => state.places.value);
  const [myPlaces, setMyPlaces] = useState(places);
  const dispatch = useDispatch();
  var fetched = [];

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => fetchNewData());
    return unsubscribe;
  }, []);

  useEffect(() => {
    dispatch(getPlaces({ fetched }));
  }, [myPlaces]);

  const fetchNewData = () => {
    fetchPlaces().then((res) => {
      fetched = res?.rows?._array;
      setMyPlaces(res?.rows?._array);
    });
  };

  const handleList = (place) => {
    return (
      <TouchableWithoutFeedback
        key={place.id}
        onPress={() => navigation.navigate("PlaceDetails")}
      >
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri: place.image }}
            style={{ resizeMode: "center" }}
          />
          <Card.Title title={place.title} />
        </Card>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.cardListCont}
        showsVerticalScrollIndicator={false}
      >
        {myPlaces?.map((place) => handleList(place))}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("NewPlace")}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardListCont: {
    justifyContent: "flex-start",
    minWidth: isApple ? "95%" : "99%",
    maxWidth: isApple ? "95.01%" : "99.01%",
    paddingBottom: isApple ? 30 : 10,
  },
  card: {
    width: "100%",
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    right: 40,
    bottom: isApple ? 60 : 40,
  },
});
