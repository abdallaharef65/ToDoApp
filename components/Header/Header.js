/* eslint-disable */
import { StyleSheet, View, Text } from "react-native";

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 15,
    backgroundColor: "#483D8B",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
  },
});

export default Header;
