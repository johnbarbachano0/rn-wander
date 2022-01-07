import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Color from "../constants/Color";
import Explore from "../screens/user/Explore";
import MenuButton from "../components/MenuButton";
import { useTheme } from "@react-navigation/native";

const ExploreStackNav = (props) => {
  const ExploreStack = createNativeStackNavigator();
  const { dark: isDark, colors } = useTheme();

  return (
    <ExploreStack.Navigator
      initialRouteName="Explore"
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
      <ExploreStack.Screen
        name="Explore"
        component={Explore}
        options={({ navigation }) => ({
          title: "Explore",
          headerLeft: () => (
            <MenuButton navigation={navigation} isDark={isDark} />
          ),
        })}
      />
    </ExploreStack.Navigator>
  );
};

export default ExploreStackNav;
