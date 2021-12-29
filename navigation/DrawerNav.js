import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Alert, Image, SafeAreaView, StyleSheet, View } from "react-native";
import Color from "../constants/Color";
import HomeStackNav from "./HomeStackNav";
import { Store } from "../constants/Icons";
import BodyText from "../components/BodyText";
import MainButton from "../components/MainButton";
import TitleText from "../components/TitleText";
import { useDispatch } from "react-redux";
import { setLogout } from "../services/AuthService";
import { usePlatform } from "../components/customHooks";
import { isApple } from "../constants/isApple";
import { useTheme } from "@react-navigation/native";

const CustomDrawerContent = (props) => {
  const { windowHeight, isPortrait } = usePlatform();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    const data = [];
    dispatch(setLogout(data));
  };

  const dispatchHandler = () => {
    Alert.alert("Confirm Logout!", "Are you sure you want to logout?", [
      { text: "Logout", onPress: logoutHandler },
      { text: "No", onPress: () => {} },
    ]);
  };
  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView
        style={[
          styles.container,
          { height: windowHeight * (isApple ? 0.9 : 0.95) },
        ]}
      >
        <View style={styles.drawerCont}>
          <TitleText style={styles.title}>Wander</TitleText>
          <DrawerItemList {...props} />
        </View>
        <View style={styles.buttonCont}>
          <MainButton
            style={styles.button}
            bgUnpress={Color.secondary.light}
            bgPress={Color.secondary.dark}
            onPress={dispatchHandler}
          >
            <BodyText style={styles.buttonText}>Logout</BodyText>
          </MainButton>
          {isPortrait && (
            <Image
              style={styles.logo}
              source={require("../assets/therobotcompany.png")}
            />
          )}
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

const DrawerNav = ({ navigation, ...props }) => {
  const Drawer = createDrawerNavigator();
  const { isPortrait } = usePlatform();
  const { dark: isDark, colors } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName={"HomeDrawer"}
      screenOptions={{
        drawerStyle: {
          backgroundColor: isDark ? colors?.card : "#BEE7F2",
          width: isPortrait ? "75%" : "50%",
        },
        drawerLabelStyle: {
          color: isDark ? "white" : Color.secondary.light,
          fontSize: isApple ? 25 : 15,
          textAlign: "left",
        },
        drawerInactiveBackgroundColor: isDark
          ? Color.nuetral.light
          : "rgba(52,190,130, 0.10)",
        drawerActiveBackgroundColor: isDark
          ? Color.nuetral.dark
          : "rgba(52,190,130, 0.40)",
        drawerType: "front",
        headerShown: false,
        headerStyle: { backgroundColor: Color.primary.light },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
      }}
      defaultStatus={"closed"}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeStackNav}
        options={{
          title: "Home",
          drawerIcon: () => (
            <Store
              color={isDark ? "white" : Color.secondary.light}
              size={isApple ? 25 : 15}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNav;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  buttonCont: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: -10,
  },
  logo: {
    height: 70,
    width: "100%",
  },
  button: {
    borderRadius: 20,
    margin: 10,
    padding: 20,
    width: "90%",
  },
  title: {
    color: Color.retro.shade1,
    padding: 0,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "roboto-bold",
    fontSize: 20,
    textAlign: "center",
  },
});
