import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const AddItem = ({ addTask }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a task..."
        value={inputValue}
        onChangeText={setInputValue}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addTask(inputValue);
          setInputValue("");
        }}
      >
        <Text style={styles.buttonText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#483D8B",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#483D8B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default AddItem;