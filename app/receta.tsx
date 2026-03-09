import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

export default function RecetaScreen() {
  const { title } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const animatedValue = useSharedValue(0);
  // estas estan locales en la carpeta assets (estas las podemos mandar igual a la base de datos locales, para ya no mover las imagenes POLETH)
  const images: any = {
    "Red velvet": require("@/assets/images/pastel1.jpg"),
    Chocolate: require("@/assets/images/pastel2.jpg"),
    Vainilla: require("@/assets/images/pastel3jpg.jpg"),
    "Fresa Crema": require("@/assets/images/pastel4.jpg"),
    "Pay de Queso": require("@/assets/images/payQueso.jpg"),
    "Pay de Limón": require("@/assets/images/payLimon.jpg"),
    "Pay de Manzana": require("@/assets/images/payManzana.jpg"),
    "Pay Frutal": require("@/assets/images/payFrutal.jpg"),
    "Galleta de chocolate": require("@/assets/images/galletaChoco.jpg"),
    "Galleta Red velvet": require("@/assets/images/GalletaRed.jpg"),
    "Galleta Biscoff": require("@/assets/images/galletaBiscoff.jpg"),
    "Galleta Pistacho Chocolate": require("@/assets/images/galletaPistacho.jpg"),
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const storedFavs = await AsyncStorage.getItem("mis_favoritos");
        if (storedFavs) {
          const favsArray = JSON.parse(storedFavs);
          const exists = favsArray.some((item: any) => item.title === title);
          setIsFavorite(exists);
          animatedValue.value = exists ? 1 : 0;
        }
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };
    checkStatus();
  }, [title]);


  const toggleFavorite = async () => {
    try {
      const storedFavs = await AsyncStorage.getItem("mis_favoritos");
      let favsArray = storedFavs ? JSON.parse(storedFavs) : [];

      if (isFavorite) {
        favsArray = favsArray.filter((item: any) => item.title !== title);
      } else {
        favsArray.push({ title: title, image: title });
      }

      await AsyncStorage.setItem("mis_favoritos", JSON.stringify(favsArray));

      const toValue = isFavorite ? 0 : 1;
      animatedValue.value = withSpring(toValue, { damping: 15 });
      setIsFavorite(!isFavorite);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar favoritos");
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isFavorite ? 1.2 : 1) }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(animatedValue.value, [0, 1], ["#555", "#ff4d4d"]);
    return { color };
  });
  // son para los contenedores 
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageWrapper}>
        <Image source={images[title as string]} style={styles.image} contentFit="cover" />
        <Pressable onPress={toggleFavorite} style={styles.favoriteButtonContainer}>
          <Animated.View style={[styles.favoriteButton, buttonAnimatedStyle]}>
            <Animated.Text style={iconAnimatedStyle}>
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="inherit" />
            </Animated.Text>
          </Animated.View>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Ingredientes</Text>
        <Text style={styles.text}>• Harina, Azúcar, Huevos, Leche</Text>
        <Text style={styles.subtitle}>Preparación</Text>
        <Text style={styles.text}>Mezclar y hornear a 180°C por 35 min.</Text>
      </View>
    </ScrollView>
  );
}

// Esta parte estoy pesnando en moverla a un archivo de estilos por mientras dejarlo aaqui :) 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageWrapper: {
    position: 'relative',
    backgroundColor: "#fff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  image: { width: "100%", height: 350, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  favoriteButtonContainer: { position: 'absolute', bottom: -25, right: 30, zIndex: 10 },
  favoriteButton: {
    backgroundColor: '#fff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  content: { padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: "bold", color: "#573011", marginBottom: 5 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#D4A373", marginTop: 20, marginBottom: 10 },
  text: { fontSize: 16, lineHeight: 24, color: "#555" },
});