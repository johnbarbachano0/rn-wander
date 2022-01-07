import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateAsync,
} from "expo-local-authentication";
import { Button, Paragraph } from "react-native-paper";
import { isApple } from "../../constants/isApple";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from "../../features/AuthSlice";

const Login = () => {
  const { loggedIn } = useSelector((state) => state.auth.value.authData);
  const [authStatus, setAuthStatus] = useState();
  const authOptions = {
    promptMessage: isApple ? "Login" : "Login to Wander",
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = biometricsAuth();
    return () => unsubscribe;
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

    setAuthStatus(state);
    dispatch(setAuthData(1));
    return state;
  };

  if (authStatus === "cancelled") {
    return (
      <View style={styles.screen}>
        <Paragraph>Authentication cancelled.</Paragraph>
        <Button onPress={() => biometricsAuth()}>Try Again</Button>
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
      <Paragraph>Authentication in progress.</Paragraph>
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
