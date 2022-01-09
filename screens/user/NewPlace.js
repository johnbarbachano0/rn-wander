import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { isApple } from "../../constants/isApple";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import MainCamera from "../../components/MainCamera";
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
import * as FileSystem from "expo-file-system";
import { insertPlace, updatePlace } from "../../helpers/db";
import MapPreview from "../../components/MapPreview";
import MainMap from "../../components/MainMap";

const NewPlace = ({ navigation, route }) => {
  const { navPath, id } = route.params;
  const isAdd = navPath === "Home";
  const dispatch = useDispatch();
  const { places } = useSelector((state) => state.places.value);
  const place = places.filter((place) => place.id === id).pop();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(
    isAdd ? new Date(Date.now()) : JSON.parse(place?.visitAt)
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [locationUri, setLocationUri] = useState(
    isAdd ? null : place?.locationUri
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(placesSchema),
    defaultValues: isAdd
      ? {
          visitAt: date,
        }
      : { ...place, visitAt: JSON.parse(place.visitAt) },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isAdd ? "Add New Place" : "Edit Place",
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      Keyboard.dismiss();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    !isAdd &&
      setValue(
        "location",
        { latitude: place.lat, longitude: place.lon },
        { shouldDirty: false }
      );
    !isAdd &&
      setValue("locationUri", place.locationUri, { shouldDirty: false });
    !isAdd &&
      setValue("visitAt", JSON.parse(place?.visitAt), { shouldDirty: false });
    !isAdd && setValue("image", place.image, { shouldDirty: false });
  }, [place]);

  const onDateChange = (event, selectedDate) => {
    setShowCalendar(Platform.OS === "ios");
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setValue("visitAt", currentDate, { shouldDirty: true });
  };

  const handleCalendar = () => {
    isApple ? setShowCalendar((prev) => !prev) : setShowCalendar(true);
  };

  const handleImagePicked = (imagePath) => {
    setValue("image", imagePath, { shouldDirty: true });
  };

  const handleLocation = (loc, uri) => {
    setValue("location", loc, { shouldDirty: true });
    setValue("locationUri", uri, { shouldDirty: true });
    setLocationUri(uri);
  };

  const handleBack = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  const handleYes = async (data) => {
    setLoading(true);
    const newPlace = new Place(
      isAdd ? useRandomNumber(99999999) : place.id,
      data.title,
      data.description,
      JSON.stringify(data.visitAt),
      data.address,
      "N/A",
      isAdd ? useIsoDate(new Date(Date.now())) : place.createdAt,
      useIsoDate(new Date(Date.now())),
      data.image,
      data.location.latitude,
      data.location.longitude,
      data.locationUri
    );
    const imageName = data.image.split("/").pop();
    const newImageUri = FileSystem.documentDirectory + imageName;
    var params = { ...newPlace, image: newImageUri };
    try {
      newImageUri !== data.image &&
        FileSystem.moveAsync({
          from: newPlace.image,
          to: newImageUri,
        }).catch((error) => {
          throw new Error("Error in moving files from cache.");
        });
      const dbAction = isAdd ? insertPlace(params) : updatePlace(params);
      dbAction
        .then((res) => {
          dispatch(setPlace({ newPlace }));
          setLoading(false);
          Alert.alert("Success!", "New place has been saved!", [
            { text: "OK", onPress: () => handleBack() },
          ]);
        })
        .catch((error) => {
          throw new Error("Error in saving to database");
        });
    } catch (error) {
      setLoading(false);
      Alert.alert("Error!", "Error in saving new place.", [
        { text: "Try Again", onPress: () => {} },
      ]);
    }
  };

  const onSubmit = async (data) => {
    isDirty
      ? Alert.alert("Confirm!", "Are you sure you want to save?", [
          {
            text: "Yes",
            onPress: () => {
              handleYes(data);
            },
          },
          {
            text: "No",
            onPress: () => {},
          },
        ])
      : Alert.alert("No Changes!", "There are no changes to save.", [
          { text: "OK", onPress: () => {} },
          {
            text: "Back",
            onPress: () => {
              handleBack();
            },
          },
        ]);
  };

  if (showMap) {
    return (
      <MainMap
        setShowMap={setShowMap}
        onPickedLocation={(loc, uri) => handleLocation(loc, uri)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      enabled={isApple ? true : false}
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
            name="address"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                type="flat"
                placeholder="Address"
                error={errors?.address ? true : false}
                value={value}
                onChangeText={onChange}
                maxLength={50}
              />
            )}
          />
          {errors?.address && (
            <ErrorText>&#x26A0; {errors?.address?.message}</ErrorText>
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
                right={
                  <TextInput.Icon name="calendar" onPress={handleCalendar} />
                }
                disabled={true}
              />
            )}
          />
          {errors?.visitAt && (
            <ErrorText>&#x26A0; {errors?.visitAt?.message}</ErrorText>
          )}
          {showCalendar && (
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
              <MapPreview value={value} locationUri={locationUri} />
            )}
          />
          <Controller
            control={control}
            name="locationUri"
            render={({ field: { value } }) => (
              <TextInput style={styles.hiddenInput} value={value} />
            )}
          />
          <Button
            onPress={() => setShowMap(true)}
            loading={showMap}
            disabled={showMap}
            labelStyle={styles.buttonPick}
          >
            Open Map
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            {isAdd ? "Submit" : "Save Changes"}
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
    height: "100%",
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
  buttonPick: { padding: 10 },
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
  hiddenInput: {
    display: "none",
  },
});
