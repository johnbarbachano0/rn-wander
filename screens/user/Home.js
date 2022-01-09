import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Keyboard,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Appbar,
  Card,
  DarkTheme,
  DefaultTheme,
  FAB,
  Paragraph,
  Searchbar,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { getPlaces } from "../../features/PlacesSlice";
import { isApple } from "../../constants/isApple";
import { fetchPlaces } from "../../helpers/db";
import { useKeyboard } from "../../components/useKeyboard";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import CardsList from "../../components/CardsList";
import SortBox from "../../components/SortBox";
import { useTheme } from "@react-navigation/native";

const Home = ({ navigation, ...props }) => {
  const keyEl = useRef();
  const { places, sortValues } = useSelector((state) => state.places.value);
  const [searchQuery, setSearchQuery] = useState("");
  const [myPlaces, setMyPlaces] = useState(places);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const isDrawerOpen = useDrawerStatus() === "open";
  const [appbarStyle, setAppbarStyle] = useState({
    paddingBottom: isApple ? 20 : 0,
  });
  const [showSortBox, setShowSortBox] = useState(false);
  const isFocused = useIsFocused();
  const { keyboardHeight } = useKeyboard();
  const { dark: isDark, colors } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchNewData();
    });
    return unsubscribe;
  }, [isFocused, places, navigation]);

  useEffect(() => {
    const unsubscribe = dispatch(getPlaces({ myPlaces }));
    return () => unsubscribe;
  }, [myPlaces]);

  useEffect(() => {
    const fetch = fetchNewData();
    return () => fetch;
  }, [sortValues]);

  useEffect(() => {
    const unsubscribe =
      isDrawerOpen && keyboardHeight > 0 && Keyboard.dismiss();
    return () => unsubscribe;
  }, [isDrawerOpen]);

  useEffect(() => {
    isDrawerOpen && navigation.closeDrawer();
  }, []);

  useEffect(() => {
    keyboardHeight > 0
      ? setAppbarStyle({ paddingBottom: 0 })
      : setAppbarStyle({ paddingBottom: isApple ? 20 : 0 });
  }, [keyboardHeight, isFocused]);

  const onChangeSearch = async (query) => {
    setSearchQuery(query);
    if (query === "") {
      fetchNewData();
    } else {
      const newArr = await myPlaces.filter((place) => {
        if (
          place.title.match(new RegExp(`${query}`, "gi")) ||
          place.description.match(new RegExp(`${query}`, "gi")) ||
          place.address.match(new RegExp(`${query}`, "gi"))
        ) {
          return place;
        } else {
          return;
        }
      });
      setMyPlaces(newArr);
    }
  };

  const refreshHandler = () => {
    setRefreshing(true);
    fetchNewData()
      .then((res) => {
        if (res) {
          setSearchQuery("");
          setRefreshing(false);
        } else {
          setRefreshing(false);
        }
      })
      .catch((error) => {
        Alert.alert("Error!", "Error in getting data from database.", [
          {
            text: "Try Again",
            onPress: () => {
              refreshHandler();
            },
          },
        ]);
      });
  };

  const fetchNewData = () => {
    const done = fetchPlaces(sortValues.column, sortValues.sortOrder)
      .then((res) => {
        fetched = res?.rows?._array;
        setMyPlaces(res?.rows?._array);
        return true;
      })
      .catch((error) => {
        return false;
      });
    return done;
  };

  const handleShowKeyboard = () => {
    if (keyboardHeight > 1) {
      keyEl.current.blur();
    } else {
      keyEl.current.focus();
    }
  };

  const handleCardClick = (id) => {
    keyboardHeight > 0 && Keyboard.dismiss();
    navigation.navigate("PlaceDetails", { id });
  };

  const handleAdd = () => {
    keyboardHeight > 0 && Keyboard.dismiss();
    navigation.navigate("NewPlace", { navPath: "Home" });
  };

  const handleShowSort = () => {
    keyboardHeight > 0 && Keyboard.dismiss();
    setShowSortBox((prev) => !prev);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.cardListCont}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />
        }
      >
        {myPlaces.length === 0 ? (
          <Card style={styles.card}>
            <Paragraph style={styles.text}>No places to display!</Paragraph>
          </Card>
        ) : (
          <CardsList
            myPlaces={myPlaces}
            onCardClick={(id) => handleCardClick(id)}
          />
        )}
      </ScrollView>
      <Appbar
        style={[
          styles.appbar,
          appbarStyle,
          {
            height: isApple ? (keyboardHeight > 0 ? 60 : 75) : 55,
            bottom: isApple ? keyboardHeight : 0,
            backgroundColor: isDark ? colors?.card : "#fff",
          },
        ]}
      >
        <Appbar.Action icon="sort" onPress={handleShowSort} />
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
          clearIcon="close"
          ref={keyEl}
        />
        <Appbar.Action icon="keyboard" onPress={handleShowKeyboard} />
      </Appbar>
      {!showSortBox && (
        <FAB style={styles.fab} icon="plus" onPress={handleAdd} />
      )}
      {showSortBox && (
        <SortBox
          onHideDialog={handleShowSort}
          sortValues={sortValues}
          onCancel={() => setShowSortBox(false)}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  cardListCont: {
    justifyContent: "flex-start",
    width: "100%",
    paddingBottom: 110,
  },
  card: {
    width: "100%",
    minWidth: isApple ? "95%" : "99%",
    maxWidth: "100%",
    marginTop: 10,
  },
  text: {
    padding: 40,
    fontSize: 18,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: isApple ? 85 : 60,
  },
  appbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  searchbar: {
    flex: 1,
  },
});
