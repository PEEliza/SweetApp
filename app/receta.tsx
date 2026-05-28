import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function RecetaScreen() {
  const { id, spoonacularId, spoonTitle, spoonImage, categoryId } =
    useLocalSearchParams<{
      id?: string;
      spoonacularId?: string;
      spoonTitle?: string;
      spoonImage?: string;
      categoryId?: string;
    }>();

  const [recipe, setRecipe] = useState<any>(null);
  const [backendId, setBackendId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (id) {
        try {
          const res = await fetch(`${API_BASE}/recipes/${id}`);
          if (res.ok) {
            const data = await res.json();
            setBackendId(data.id);
            setRecipe({
              title: data.title,
              image: data.image_url,
              category: data.category?.name ?? null,
              ingredients: data.ingredients?.map((i: any) => `${i.name}${i.quantity ? " — " + i.quantity : ""}`) ?? [],
              steps: data.steps ?? [],
              isBackend: true,
            });
          }
        } catch {
          Alert.alert("Error", "No se pudo cargar la receta.");
        }
      } else if (spoonacularId && spoonTitle) {
        try {
          const token = await SecureStore.getItemAsync("userToken");
          const res = await fetch(
            `${API_BASE}/spoonacular/detail/${spoonacularId}`,
            token ? { headers: { Authorization: `Bearer ${token}` } } : {}
          );
          if (res.ok) {
            const data = await res.json();
            setRecipe({
              title: data.title ?? spoonTitle,
              image: data.image ?? spoonImage,
              category: null,
              ingredients: data.extendedIngredients?.map((i: any) => i.original) ?? [],
              steps: [],
              instructions: data.instructions?.replace(/<[^>]*>?/gm, "") ?? "Ver pasos en Spoonacular.",
              isBackend: false,
              isSpoonacular: true,
            });
          }
        } catch {
          Alert.alert("Error", "No se obtuvo respuesta de Spoonacular.");
        }
      }
      setLoading(false);
    };
    load();
  }, [id, spoonacularId]);

  useEffect(() => {
    const check = async () => {
      const resolvedId = id ? Number(id) : backendId;
      if (!resolvedId) return;
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) return;
      const res = await fetch(`${API_BASE}/user-favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const favs = await res.json();
        const exists = Array.isArray(favs) && favs.some((f: any) => f.id === resolvedId);
        setIsFavorite(exists);
        animatedValue.value = exists ? 1 : 0;
      }
    };
    check();
  }, [id, backendId]);

  const toggleFavorite = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para guardar favoritos.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
      return;
    }
    setFavLoading(true);
    try {
      let targetId = id ? Number(id) : backendId;
      if (!targetId && spoonacularId) {
        const saveRes = await fetch(`${API_BASE}/recipes/from-spoonacular`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            spoonacularId: Number(spoonacularId),
            categoryId: categoryId ? Number(categoryId) : null,
          }),
        });
        if (saveRes.ok) {
          const saved = await saveRes.json();
          targetId = saved.id;
          setBackendId(saved.id);
        }
      }

      if (!targetId) return;

      if (isFavorite) {
        const res = await fetch(`${API_BASE}/user-favorites/${targetId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok || res.status === 204) {
          animatedValue.value = withSpring(0);
          setIsFavorite(false);
        }
      } else {
        const res = await fetch(`${API_BASE}/user-favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId: targetId }),
        });
        if (res.ok || res.status === 201) {
          animatedValue.value = withSpring(1);
          setIsFavorite(true);
        }
      }
    } catch {
      Alert.alert("Error", "No se pudo actualizar la receta favorita.");
    } finally {
      setFavLoading(false);
    }
  };

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(animatedValue.value, [0, 1], ["#555", "#ff4d4d"]),
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#D4A373" />
      </View>
    );
  }

  if (!recipe) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageWrapper}>
        <Image
          source={recipe.image ? { uri: recipe.image } : require("@/assets/images/pastel1.jpg")}
          style={styles.image}
          contentFit="cover"
        />
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#573011" />
        </Pressable>
        <View style={styles.favoriteButtonContainer}>
          <Pressable onPress={toggleFavorite} style={styles.favoriteButton} disabled={favLoading}>
            {favLoading ? (
              <ActivityIndicator size="small" color="#D4A373" />
            ) : (
              <Animated.Text style={iconAnimatedStyle}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="inherit" />
              </Animated.Text>
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.content}>
        {recipe.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
        )}
        <Text style={styles.title}>{recipe.title}</Text>
        {recipe.ingredients?.length > 0 && (
          <>
            <Text style={styles.subtitle}>Ingredientes</Text>
            {recipe.ingredients.map((ing: string, i: number) => (
              <Text key={i} style={styles.text}>• {ing}</Text>
            ))}
          </>
        )}
        <Text style={styles.subtitle}>Preparación</Text>
        {recipe.isBackend && recipe.steps?.length > 0 ? (
          recipe.steps
            .sort((a: any, b: any) => (a.step_number ?? a.stepNumber) - (b.step_number ?? b.stepNumber))
            .map((step: any) => (
              <Text key={step.id} style={styles.text}>
                {step.step_number ?? step.stepNumber}. {step.instruction}
              </Text>
            ))
        ) : (
          <Text style={styles.text}>{recipe.instructions ?? "Preparación no disponible."}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageWrapper: { position: "relative", backgroundColor: "#fff", borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 15 },
  image: { width: "100%", height: 350, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  backBtn: { position: "absolute", top: 50, left: 20, backgroundColor: "rgba(255,255,255,0.8)", padding: 8, borderRadius: 20 },
  favoriteButtonContainer: { position: "absolute", bottom: -25, right: 30, zIndex: 10 },
  favoriteButton: { backgroundColor: "#fff", width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  content: { padding: 20, paddingTop: 40 },
  categoryBadge: { alignSelf: "flex-start", backgroundColor: "#FFF3E0", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8 },
  categoryText: { fontSize: 12, color: "#D4A373", fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "bold", color: "#573011", marginBottom: 5 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#D4A373", marginTop: 20, marginBottom: 10 },
  text: { fontSize: 16, lineHeight: 24, color: "#555", marginBottom: 5 },
});