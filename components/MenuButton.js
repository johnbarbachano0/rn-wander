import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Color from "../constants/Color";
import { MenuIcon } from "../constants/Icons";

const MenuButton = (props) => {
  return (
    <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
      <MenuIcon
        style={{ color: props.isDark ? "white" : Color.primaryGreen.dark }}
      />
    </TouchableOpacity>
  );
};

export default MenuButton;
