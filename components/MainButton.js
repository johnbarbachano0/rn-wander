import React from "react";
import { Pressable, StyleSheet } from "react-native";

const MainButton = (props) => {
  return (
    <Pressable
      {...props}
      onPress={props.onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.button,
        props.style,
        {
          backgroundColor: pressed ? props.bgPress : props.bgUnpress,
        },
      ]}
    >
      {props.children}
    </Pressable>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    padding: 10,
  },
});
