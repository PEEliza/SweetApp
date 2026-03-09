import { StyleSheet } from "react-native";

export const imageStyles = StyleSheet.create({
  headerImageContainer: {
    width: "100%",
    height: 260,
    borderRadius: 25,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
