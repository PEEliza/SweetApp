import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const GAP = 16;
const PADDING_HORIZONTAL = 10;
// Calculamos el ancho para que quepan 2 tarjetas exactas restando gaps y paddings
const CARD_WIDTH = (width - PADDING_HORIZONTAL * 2 - GAP) / 2;

export const styles = StyleSheet.create({
  container: {
    padding: 1,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 3,
    alignItems: "center",
  },

  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#884628",
  },

  button: {
    marginTop: 10,
    backgroundColor: "#d8c3a3",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  buttonText: {
    fontWeight: "bold",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
