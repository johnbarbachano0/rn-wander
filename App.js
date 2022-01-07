import "react-native-gesture-handler";
import React, { useState } from "react";
import AppLoading from "expo-app-loading";
import { AppRegistry, useColorScheme, Alert } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
} from "@react-navigation/native";
import { name as appName } from "./app.json";
import { theme } from "./constants/theme";
import fetchFonts from "./constants/Fonts";
import Navigation from "./navigation/Navigation";
import { store } from "./store/store";
import { Provider as ReduxProvider } from "react-redux";
import { init, dropTable } from "./helpers/db";

init()
  .then(() => {
    console.log("Initialized database");
  })
  .catch((error) => {
    Alert.alert("Database Error!", "Restart App.", [
      { text: "OK", onPress: () => {} },
    ]);
    console.log(error);
  });

// dropTable("places").then((res) => console.log(res));

export default function App() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  if (loading) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setLoading(false)}
        onError={(err) => console.log(err)}
      />
    );
  }

  const CombinedDefaultTheme = {
    ...theme.DefaultTheme,
    ...NavDefaultTheme,
    colors: {
      ...theme.DefaultTheme.colors,
      ...NavDefaultTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...theme.DarkTheme,
    ...NavDarkTheme,
    colors: {
      ...theme.DarkTheme.colors,
      ...NavDarkTheme.colors,
    },
  };

  return (
    <ReduxProvider store={store}>
      <PaperProvider
        theme={
          colorScheme === "light" ? CombinedDefaultTheme : CombinedDarkTheme
        }
      >
        <NavigationContainer
          theme={
            colorScheme === "light" ? CombinedDefaultTheme : CombinedDarkTheme
          }
        >
          <Navigation />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
