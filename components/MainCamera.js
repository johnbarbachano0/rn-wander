import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button, Card } from "react-native-paper";

const MainCamera = ({ onImagePicked }) => {
  const [pickedImagePath, setPickedImagePath] = useState("");

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "No permissions!",
        "You need camera roll permissions to use this app.",
        [{ text: "OK", onPress: () => {} }]
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      onImagePicked(result.uri);
    }
  };

  // Open Camera Button is pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "No permissions!",
        "You need camera permissions to use this app.",
        [{ text: "OK", onPress: () => {} }]
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      onImagePicked(result.uri);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.imageContainer}>
        {pickedImagePath === "" ? (
          <Card style={styles.card}>
            <Text style={styles.text}>No image selected</Text>
          </Card>
        ) : (
          <Card style={styles.card}>
            <Card.Cover
              source={{ uri: pickedImagePath }}
              style={styles.image}
            />
          </Card>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={showImagePicker}>Select image</Button>
        <Button onPress={openCamera}>Open camera</Button>
      </View>
    </View>
  );
};

export default MainCamera;

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: 20,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
  },
  card: { width: "100%", resizeMode: "center" },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "center",
  },
  text: { color: "#888", fontSize: 18, padding: 20, textAlign: "center" },
});
