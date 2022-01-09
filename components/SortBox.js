import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, Divider, RadioButton } from "react-native-paper";
import RadioItem from "./RadioItem";
import { setSortValues } from "../features/PlacesSlice";
import { useDispatch } from "react-redux";
import { isApple } from "../constants/isApple";

const SortBox = ({ onHideDialog, sortValues, onCancel }) => {
  const [orderValue, setOrderValue] = useState(sortValues.sortOrder);
  const [filterValue, setFilterValue] = useState(sortValues.column);
  const dispatch = useDispatch();

  const handleSort = () => {
    dispatch(
      setSortValues({
        newSortValues: { column: filterValue, sortOrder: orderValue },
      })
    );
    onHideDialog();
  };

  const filters = () => {
    return (
      <ScrollView contentContainerStyle={styles.android}>
        <View style={styles.filter}>
          <RadioItem label="Update Date" value="updatedAt" />
          <RadioItem label="Place" value="title" />
          <RadioItem label="Description" value="description" />
          <RadioItem label="Address" value="address" />
          <RadioItem label="Create Date" value="createdAt" />
          <RadioItem label="Visit Date" value="visitAt" />
        </View>
      </ScrollView>
    );
  };

  return (
    <Dialog visible={true} onDismiss={onHideDialog} dismissable={true}>
      <Dialog.Title>Sort by</Dialog.Title>
      <Dialog.Content>
        <RadioButton.Group
          onValueChange={(newValue) => setFilterValue(newValue)}
          value={filterValue}
        >
          {filters()}
        </RadioButton.Group>
      </Dialog.Content>
      <Divider />
      <Dialog.Title>Order</Dialog.Title>
      <Dialog.Content>
        <RadioButton.Group
          onValueChange={(newValue) => setOrderValue(newValue)}
          value={orderValue}
        >
          <View style={styles.order}>
            <RadioItem label={isApple ? "Ascending" : "Asc..."} value="ASC" />
            <RadioItem
              label={isApple ? "Descending" : "Desc..."}
              value="DESC"
            />
          </View>
        </RadioButton.Group>
      </Dialog.Content>
      <Divider />
      <Dialog.Actions>
        <Button onPress={handleSort}>Sort</Button>
        <Button onPress={onCancel}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default SortBox;

const styles = StyleSheet.create({
  order: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  },
  android: {
    // height: 150,
  },
});
