import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { isApple } from "../../constants/isApple";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import MainCamera from "../../components/MainCamera";
import MainLocation from "../../components/MainLocation";
import { setPlace } from "../../features/PlacesSlice";
import Place from "../../model/Place";
import { placesSchema } from "../../schema/PlacesSchema";
import ErrorText from "../../components/ErrorText";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useDateConverter,
  useIsoDate,
  useRandomNumber,
} from "../../components/customHooks";
import Color from "../../constants/Color";
import * as FileSystem from "expo-file-system";
import { insertPlace } from "../../helpers/db";

const NewPlace = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [show, setShow] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(placesSchema),
    defaultValues: {
      visitAt: date,
    },
  });

  const onDateChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setValue("visitAt", currentDate, { shouldDirty: true });
  };

  const handleCalendar = () => {
    isApple ? setShow((prev) => !prev) : setShow(true);
  };

  const handleImagePicked = (imagePath) => {
    setValue("image", imagePath, { shouldDirty: true });
  };

  const handleLocation = (location) => {
    setValue("location", location, { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    setShow(false);
    setLoading(true);
    const newPlace = new Place(
      useRandomNumber(999999),
      data.title,
      data.description,
      useIsoDate(data.visitAt),
      "dummy address",
      "JB",
      useIsoDate(new Date(Date.now())),
      useIsoDate(new Date(Date.now())),
      data.image,
      data.location.lat,
      data.location.lon
    );
    const imageName = data.image.split("/").pop();
    const newPath = FileSystem.documentDirectory + imageName;
    try {
      FileSystem.moveAsync({
        from: newPlace.image,
        to: newPath,
      });
      insertPlace(
        newPlace.id,
        newPlace.title,
        newPlace.description,
        newPlace.visitAt,
        newPlace.address,
        newPlace.createdBy,
        newPlace.createdAt,
        newPlace.updatedAt,
        newPath,
        newPlace.lat,
        newPlace.lon
      ).then((res) => {
        dispatch(setPlace({ newPlace }));
        setLoading(false);
        Alert.alert("Success!", "New place has been saved!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      });
    } catch (error) {
      setLoading(false);
      Alert.alert("Error!", "Error in saving new place.", [
        { text: "Try Again", onPress: () => {} },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={isApple ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={styles.screen}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                type="flat"
                placeholder="Place"
                error={errors?.title ? true : false}
                value={value}
                onChangeText={onChange}
                maxLength={50}
              />
            )}
          />
          {errors?.title && (
            <ErrorText>&#x26A0; {errors?.title?.message}</ErrorText>
          )}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                type="flat"
                placeholder="Description"
                error={errors?.description ? true : false}
                value={value}
                onChangeText={onChange}
                maxLength={250}
                multiline={true}
                numberOfLines={2}
              />
            )}
          />
          {errors?.description && (
            <ErrorText>&#x26A0; {errors?.description?.message}</ErrorText>
          )}
          <Controller
            control={control}
            name="visitAt"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                type="flat"
                placeholder="Date of Visit"
                error={errors?.visitAt ? true : false}
                value={useDateConverter(value)}
                onChangeText={onChange}
                onPress={handleCalendar}
                right={
                  <TextInput.Icon
                    name="calendar"
                    onPress={handleCalendar}
                    style={{ color: Color.primary.light }}
                  />
                }
                disabled={true}
              />
            )}
          />
          {errors?.visitAt && (
            <ErrorText>&#x26A0; {errors?.visitAt?.message}</ErrorText>
          )}
          {show && (
            <DateTimePicker
              value={date}
              mode={"date"}
              display="spinner"
              onChange={onDateChange}
              style={styles.datepicker}
            />
          )}
          {errors?.image && (
            <ErrorText style={{ textAlign: "center", paddingTop: 10 }}>
              &#x26A0; {errors?.image?.message}
            </ErrorText>
          )}
          <Controller
            control={control}
            name="image"
            render={({ field: { value } }) => (
              <MainCamera
                onImagePicked={(imagePath) => handleImagePicked(imagePath)}
                value={value}
              />
            )}
          />
          {errors?.location && (
            <ErrorText style={{ textAlign: "center", paddingTop: 10 }}>
              &#x26A0; {errors?.location?.message}
            </ErrorText>
          )}
          <Controller
            control={control}
            name="location"
            render={({ field: { value } }) => (
              <MainLocation
                onLocation={(location) => handleLocation(location)}
                value={value}
              />
            )}
          />
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading ? true : false}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Submit
          </Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default NewPlace;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  form: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    paddingTop: isApple ? 10 : 5,
    paddingBottom: isApple ? 50 : 5,
    minWidth: isApple ? "95%" : "99%",
    maxWidth: isApple ? "90.01%" : "99.01%",
  },
  input: {
    width: "100%",
    fontSize: 20,
    maxHeight: 150,
  },
  button: {
    width: "60%",
    margin: 10,
  },
  buttonText: {
    paddingVertical: 5,
    fontSize: 18,
  },
  datepicker: {
    width: "100%",
  },
});
