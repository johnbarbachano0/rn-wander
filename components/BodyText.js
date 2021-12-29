import React from "react";
import { Text } from "react-native";

const BodyText = (props) => {
  return (
    <Text {...props} style={{ fontFamily: "roboto", ...props.style }}>
      {props.children}
    </Text>
  );
};

export default BodyText;
