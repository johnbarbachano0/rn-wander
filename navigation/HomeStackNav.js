import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Color from "../constants/Color";
import Home from "../screens/user/Home";
import MapScreen from "../screens/user/MapScreen";
import PlaceDetails from "../screens/user/PlaceDetails";
import NewPlace from "../screens/user/NewPlace";
import MenuButton from "../components/MenuButton";
import { useTheme } from "@react-navigation/native";

const HomeStackNav = (props) => {
  const HomeStack = createNativeStackNavigator();
  const { dark: isDark, colors } = useTheme();

  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? colors?.card : "#BEE7F2",
        },
        headerTintColor: isDark ? "#fff" : Color.primaryGreen.dark,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerBackTitleStyle: {
          fontSize: 14,
        },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          title: "Places",
          headerLeft: () => (
            <MenuButton navigation={navigation} isDark={isDark} />
          ),
        })}
      />
      <HomeStack.Screen
        name="PlaceDetails"
        component={PlaceDetails}
        options={() => ({
          title: "Details",
        })}
      />
      <HomeStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={() => ({
          title: "Map",
        })}
      />
      <HomeStack.Screen
        name="NewPlace"
        component={NewPlace}
        options={({ route }) => ({
          title: "Add New Place",
        })}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNav;
