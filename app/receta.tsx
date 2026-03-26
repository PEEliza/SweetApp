import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function RecetaScreen() {
  const { title } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const animatedValue = useSharedValue(0);

  // Traer receta desde backend
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/recipes?search=${title}`,
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setRecipe(data[0]); // suponiendo que devuelve un array
        }
      } catch (error) {
        console.error("Error al cargar receta:", error);
      }
    };
    fetchRecipe();
  }, [title]);

  // Favoritos 
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
        favsArray.push({ title: title, image: recipe?.image_url });
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
    const color = interpolateColor(
      animatedValue.value,
      [0, 1],
      ["#555", "#ff4d4d"],
    );
    return { color };
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {recipe && (
        <>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: recipe.image_url }}
              style={styles.image}
              contentFit="cover"
            />
            <Pressable
              onPress={toggleFavorite}
              style={styles.favoriteButtonContainer}
            >
              <Animated.View
                style={[styles.favoriteButton, buttonAnimatedStyle]}
              >
                <Animated.Text style={iconAnimatedStyle}>
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={28}
                    color="inherit"
                  />
                </Animated.Text>
              </Animated.View>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{recipe.title}</Text>

            <Text style={styles.subtitle}>Ingredientes</Text>
            {recipe.ingredients?.map((ing: any, idx: number) => (
              <Text key={idx} style={styles.text}>
                • {ing.quantity} {ing.name}
              </Text>
            ))}

            <Text style={styles.subtitle}>Preparación</Text>
            {recipe.steps?.map((step: any) => (
              <Text key={step.id} style={styles.text}>
                {step.step_number}. {step.instruction}
              </Text>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageWrapper: {
    position: "relative",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  image: {
    width: "100%",
    height: 350,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  favoriteButtonContainer: {
    position: "absolute",
    bottom: -25,
    right: 30,
    zIndex: 10,
  },
  favoriteButton: {
    backgroundColor: "#fff",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  content: { padding: 20, paddingTop: 40 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#573011",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#D4A373",
    marginTop: 20,
    marginBottom: 10,
  },
  text: { fontSize: 16, lineHeight: 24, color: "#555" },
});
