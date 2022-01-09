import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateAsync,
} from "expo-local-authentication";
import { ActivityIndicator, Button, Paragraph } from "react-native-paper";
import { isApple } from "../../constants/isApple";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../features/AuthSlice";
import Color from "../../constants/Color";

const Login = () => {
  const [authStatus, setAuthStatus] = useState();
  const authOptions = {
    promptMessage: isApple ? "Login" : "Login to Wander",
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const subscribe = biometricsAuth();
    subscribe.then((res) => {
      setAuthStatus(res);
      setAuthData(res === "success" ? true : false);
    });
    return subscribe;
  }, []);

  const biometricsAuth = async () => {
    var state;
    const compatible = await hasHardwareAsync();
    if (!compatible) {
      state = "not compatible";
    }
    const enrolled = await isEnrolledAsync();
    if (!enrolled) {
      state = "no enrolled";
    }

    const result = await authenticateAsync(authOptions);
    if (!result.success) {
      state = "cancelled";
    } else if (result.success) {
      state = "success";
    }

    if (state === "success") {
      dispatch(setAuthData(1));
    } else {
      dispatch(setAuthData(0));
    }
    return state;
  };

  if (authStatus === "cancelled") {
    return (
      <View style={styles.screen}>
        <ActivityIndicator animating={true} color={Color.primary.light} />
        <Paragraph>Authentication cancelled.</Paragraph>
        <Button onPress={() => biometricsAuth()}>Sign In</Button>
      </View>
    );
  }

  if (authStatus === "no enrolled") {
    return (
      <View style={styles.screen}>
        <Paragraph>No Biometrics enrolled yet.</Paragraph>
      </View>
    );
  }

  if (authStatus === "not compatible") {
    return (
      <View style={styles.screen}>
        <Paragraph>
          This device is not compatible for biometric authentication.
        </Paragraph>
      </View>
    );
  }

  if (authStatus === "success") {
    return (
      <View style={styles.screen}>
        <Paragraph>Authentication success.</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ActivityIndicator animating={true} color={Color.primary.light} />
      <Paragraph>Authentication in progress.</Paragraph>
      <Button onPress={() => biometricsAuth()}>Sign In</Button>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
