import React from "react";
import { StyleSheet, Text } from "react-native";
import Color from "../constants/Color";
import { isApple } from "../constants/isApple";

const TitleText = (props) => {
  return (
    <Text {...props} style={{ ...styles.text, ...props.style }}>
      {props.children}
    </Text>
  );
};

export default TitleText;

const styles = StyleSheet.create({
  text: {
    fontFamily: "merriweather",
    fontSize: isApple ? 40 : 30,
    color: "black",
    textShadowColor: Color.secondary.light,
    textShadowOffset: { width: 1, height: 1.5 },
    textShadowRadius: 1,
    padding: 10,
  },
});
