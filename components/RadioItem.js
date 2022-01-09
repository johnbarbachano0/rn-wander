import React from "react";
import { RadioButton } from "react-native-paper";

const RadioItem = (props) => {
  return (
    <RadioButton.Item
      label={props.label}
      value={props.value}
      position="leading"
      mode="android"
      labelStyle={{ textAlign: "left" }}
    />
  );
};

export default RadioItem;
