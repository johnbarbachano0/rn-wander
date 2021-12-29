import React, { useState } from "react";
import { Image, StyleSheet, ScrollView, Text, View } from "react-native";
import { Button, Caption, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const MainImagePicker = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const pickImage = async () => {
    setLoading(true);
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
      .then((result) => {
        setLoading(false);
        if (!result.cancelled) {
          setImage(result.uri);
        }
        console.log(result);
      })
      .catch((error) => console.log(error));
  };

  return (
    <TouchableWithoutFeedback onPress={pickImage} style={styles.container}>
      <View style={styles.imagePreview}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <>
            <MatIcon name={"image"} size={50} color={"#888"} />
            <Caption>Click to Select Image</Caption>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MainImagePicker;

const styles = StyleSheet.create({
  container: { width: "100%", height: "50%" },
  imagePreview: {
    minWidth: "100%",
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
