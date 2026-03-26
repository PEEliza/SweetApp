import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
=======
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
>>>>>>> f9e284ff14a2dae0621b557dbaab02e7004b12ee
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { obtenerDetalleReceta } from '../types/recetas.service';

// Definir tipo para la receta (puedes moverlo a types si prefieres)
interface RecetaDetalle {
  id: string;
  title: string;
  image: string;
  ingredientes: string[];
  preparacion: string;
  categoria?: string;
}

export default function RecetaScreen() {
  // Recibir TODOS los parámetros que enviamos desde index.tsx
  const { id, title: titleParam, image: imageParam } = useLocalSearchParams();
  
  const [receta, setReceta] = useState<RecetaDetalle | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
<<<<<<< HEAD
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
=======
  const [cargando, setCargando] = useState(true);
  const animatedValue = useSharedValue(0);

  // Cargar detalles completos de la receta desde la API
>>>>>>> f9e284ff14a2dae0621b557dbaab02e7004b12ee
  useEffect(() => {
    const cargarDetalleReceta = async () => {
      if (id) {
        console.log('🔍 Cargando detalle para ID:', id);
        const detalle = await obtenerDetalleReceta(id as string);
        console.log('📦 Detalle recibido:', detalle);
        setReceta(detalle);
      }
      setCargando(false);
    };

    cargarDetalleReceta();
  }, [id]);

  // Verificar si está en favoritos
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const storedFavs = await AsyncStorage.getItem("mis_favoritos");
        if (storedFavs) {
          const favsArray = JSON.parse(storedFavs);
          // Buscar por ID en lugar de título (más preciso)
          const exists = favsArray.some((item: any) => item.id === id);
          setIsFavorite(exists);
          animatedValue.value = exists ? 1 : 0;
        }
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };
<<<<<<< HEAD
    checkStatus();
  }, [title]);
=======
    
    checkFavoriteStatus();
  }, [id]);
>>>>>>> f9e284ff14a2dae0621b557dbaab02e7004b12ee

  const toggleFavorite = async () => {
    try {
      const storedFavs = await AsyncStorage.getItem("mis_favoritos");
      let favsArray = storedFavs ? JSON.parse(storedFavs) : [];

      if (isFavorite) {
        // Eliminar de favoritos
        favsArray = favsArray.filter((item: any) => item.id !== id);
      } else {
<<<<<<< HEAD
        favsArray.push({ title: title, image: recipe?.image_url });
=======
        // Agregar a favoritos con toda la información
        favsArray.push({ 
          id: id, 
          title: receta?.title || titleParam,
          image: receta?.image || imageParam 
        });
>>>>>>> f9e284ff14a2dae0621b557dbaab02e7004b12ee
      }

      await AsyncStorage.setItem("mis_favoritos", JSON.stringify(favsArray));

      const toValue = isFavorite ? 0 : 1;
      animatedValue.value = withSpring(toValue, { damping: 15 });
      setIsFavorite(!isFavorite);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar favoritos");
    }
  };

  // Animaciones
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

<<<<<<< HEAD
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
=======
  // Mostrar cargando mientras obtenemos los detalles
  if (cargando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#D4A373" />
        <Text style={{ marginTop: 10 }}>Cargando receta...</Text>
      </View>
    );
  }

  // Determinar qué imagen mostrar (prioridad: API > parámetro)
  const imageSource = receta?.image || imageParam;
  const titulo = receta?.title || titleParam;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageWrapper}>
        {/* Usamos la imagen de la API si existe, sino la local */}
        <Image 
          source={imageSource ? { uri: imageSource } : require("@/assets/images/homepastel.jpg")} 
          style={styles.image} 
          contentFit="cover" 
        />
        <Pressable onPress={toggleFavorite} style={styles.favoriteButtonContainer}>
          <Animated.View style={[styles.favoriteButton, buttonAnimatedStyle]}>
            <Animated.Text style={iconAnimatedStyle}>
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="inherit" />
            </Animated.Text>
          </Animated.View>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{titulo}</Text>
        
        <Text style={styles.subtitle}>Ingredientes</Text>
        {receta?.ingredientes && receta.ingredientes.length > 0 ? (
          receta.ingredientes.map((ingrediente, index) => (
            <Text key={index} style={styles.text}>• {ingrediente}</Text>
          ))
        ) : (
          <Text style={styles.text}>• Harina, Azúcar, Huevos, Leche (Datos de ejemplo)</Text>
        )}
        
        <Text style={styles.subtitle}>Preparación</Text>
        <Text style={styles.text}>
          {receta?.preparacion || "Mezclar y hornear a 180°C por 35 min. (Datos de ejemplo)"}
        </Text>
      </View>
>>>>>>> f9e284ff14a2dae0621b557dbaab02e7004b12ee
    </ScrollView>
  );
}

<<<<<<< HEAD
=======
// Actualizar estilos para incluir el centered
>>>>>>> f9e284ff14a2dae0621b557dbaab02e7004b12ee
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
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
<<<<<<< HEAD
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
=======
  title: { fontSize: 28, fontWeight: "bold", color: "#573011", marginBottom: 20 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#D4A373", marginTop: 20, marginBottom: 10 },
  text: { fontSize: 16, lineHeight: 24, color: "#555", marginBottom: 5 },
});
>>>>>>> f9e284ff14a2dae0621b557dbaab02e7004b12ee
