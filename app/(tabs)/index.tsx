import { ThemedView } from "@/components/themed-view";
import { styles } from "@/constants/StyleSheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_layout";

import { API_ROUTES } from "@/constants/api";

const { width } = Dimensions.get("window");
const GAP = 16;
const CARD_WIDTH = (width - 40 - GAP) / 2;
const PADDING = 20;

interface Category {
  id: number;
  name: string;
  spoonQuery: string;
}

interface Recipe {
  id: number;
  title: string;
  image_url: string | null;
  isSpoonacular?: boolean;
  spoonacularId?: number;
}

const CATEGORY_SPOON_MAP: Record<string, string> = {
  Pasteles: "cake",
  Pays: "pie",
  Galletas: "cookie",
  Cupcakes: "cupcake",
  Brownies: "brownie",
  Panadería: "pastry",
  "Postres Fríos": "ice cream",
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [localRecipes, setLocalRecipes] = useState<Recipe[]>([]);
  const [spoonRecipes, setSpoonRecipes] = useState<any[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [loadingSpoon, setLoadingSpoon] = useState(false);

  useEffect(() => {
    fetch(API_ROUTES.categories.getAll)
      .then((r) => r.json())
      .then((data: { id: number; name: string }[]) => {
        const cats = data.map((c) => ({
          ...c,
          spoonQuery: CATEGORY_SPOON_MAP[c.name] ?? c.name.toLowerCase(),
        }));
        setCategories(cats);
      })
      .catch((e) => console.error("Error al cargar categorías:", e));
  }, []);

  const handleCategoryPress = async (cat: Category) => {
    if (selectedCategory?.id === cat.id) {
      setSelectedCategory(null);
      setLocalRecipes([]);
      setSpoonRecipes([]);
      return;
    }
    setSelectedCategory(cat);
    setLocalRecipes([]);
    setSpoonRecipes([]);

    setLoadingLocal(true);
    try {
      const res = await fetch(API_ROUTES.recipes.getByCategory(cat.id));
      if (res.ok) setLocalRecipes(await res.json());
    } catch (e) {
      console.error("Error backend:", e);
    } finally {
      setLoadingLocal(false);
    }

    setLoadingSpoon(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const res = await fetch(
       API_ROUTES.spoonacular.search(cat.spoonQuery),
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      if (res.ok) {
        const data = await res.json();
        setSpoonRecipes(data.results ?? []);
      }
    } catch (e) {
      console.error("Error Spoonacular:", e);
    } finally {
      setLoadingSpoon(false);
    }
  };

  const renderLocalCard = (recipe: Recipe) => (
    <TouchableOpacity
      key={`local-${recipe.id}`}
      onPress={() =>
        router.push({ pathname: "/receta", params: { id: String(recipe.id) } })
      }
    >
      <View style={[styles.card, { width: CARD_WIDTH }]}>
        <Image
          source={
            recipe.image_url
              ? { uri: recipe.image_url }
              : require("@/assets/images/pastel1.jpg")
          }
          style={styles.cardImage}
          contentFit="cover"
        />
        <Text style={styles.cardTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSpoonCard = (item: any) => (
    <TouchableOpacity
      key={`spoon-${item.id}`}
      onPress={() =>
        router.push({
          pathname: "/receta",
          params: {
            spoonacularId: String(item.id),
            spoonTitle: item.title,
            spoonImage: item.image ?? "",
            categoryId: String(selectedCategory?.id ?? ""),
          },
        })
      }
    >
      <View style={[styles.card, { width: CARD_WIDTH }]}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          contentFit="cover"
        />
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={{ flex: 1, paddingTop: 50 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: PADDING, marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "hsl(29, 49%, 59%)" }}>
            ¡Hola, {user ?? "chef"} 👩‍🍳!
          </Text>
          <Text style={{ fontSize: 13, color: "#aaa", marginTop: 2 }}>
            ¿Qué postre preparamos hoy?
          </Text>
        </View>

        <View style={{ paddingHorizontal: PADDING, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "hsl(29, 49%, 59%)", marginBottom: 12 }}>
            Explorar categorías
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -PADDING }}
            contentContainerStyle={{ paddingHorizontal: PADDING, gap: 10 }}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleCategoryPress(cat)}
                style={{
                  backgroundColor: selectedCategory?.id === cat.id ? "hsl(29, 49%, 59%)" : "#f0e6dd",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: selectedCategory?.id === cat.id ? "#fff" : "hsl(29, 49%, 59%)",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedCategory && (
          <View style={{ paddingHorizontal: PADDING }}>
            {loadingLocal ? (
              <ActivityIndicator color="hsl(29, 49%, 59%)" style={{ marginBottom: 20 }} />
            ) : localRecipes.length > 0 ? (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#8b5e3c", marginBottom: 12 }}>
                  {selectedCategory.name} — Nuestras recetas
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -PADDING }}
                  contentContainerStyle={{ paddingHorizontal: PADDING, gap: GAP }}
                >
                  {localRecipes.map(renderLocalCard)}
                </ScrollView>
              </View>
            ) : null}

            {loadingSpoon ? (
              <ActivityIndicator color="hsl(29, 49%, 59%)" style={{ marginBottom: 20 }} />
            ) : spoonRecipes.length > 0 ? (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#8b5e3c", marginBottom: 12 }}>
                  {selectedCategory.name} — Más recetas
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -PADDING }}
                  contentContainerStyle={{ paddingHorizontal: PADDING, gap: GAP }}
                >
                  {spoonRecipes.map(renderSpoonCard)}
                </ScrollView>
              </View>
            ) : null}

            {!loadingLocal && !loadingSpoon && localRecipes.length === 0 && spoonRecipes.length === 0 && (
              <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
                No se encontraron recetas en esta categoría.
              </Text>
            )}
          </View>
        )}

        {!selectedCategory &&
          categories.map((cat) => (
            <View key={cat.id} style={{ paddingHorizontal: PADDING, marginBottom: 24 }}>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "hsl(29, 49%, 59%)" }}>
                {cat.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleCategoryPress(cat)}
                style={{
                  alignSelf: "center",
                  backgroundColor: "hsl(29, 49%, 59%)",
                  paddingVertical: 10,
                  paddingHorizontal: 48,
                  borderRadius: 8,
                  marginTop: 12,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                  Ver {cat.name}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}