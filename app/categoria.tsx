import { styles } from "@/constants/StyleSheet";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';
const { width } = Dimensions.get("window");
const GAP = 16;
const CARD_WIDTH = (width - 40 - GAP) / 2;

const CATEGORY_SPOON_MAP: Record<string, string> = {
  Pasteles: "cake",
  Pays: "pie",
  Galletas: "cookie",
  Cupcakes: "cupcake",
  Brownies: "brownie",
  Panadería: "pastry",
  "Postres Fríos": "ice cream",
};

export default function CategoriaScreen() {
  const { tipo, nombre } = useLocalSearchParams<{ tipo: string; nombre: string }>();
  const [localRecetas, setLocalRecetas] = useState<any[]>([]);
  const [spoonRecetas, setSpoonRecetas] = useState<any[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [loadingSpoon, setLoadingSpoon] = useState(true);

  useEffect(() => {
    if (!tipo || !nombre) return;
    cargarDatos();
  }, [tipo, nombre]);

  const cargarDatos = async () => {
    setLoadingLocal(true);
    setLoadingSpoon(true);

    try {
      const res = await fetch(`${API_BASE}/recipes?categoryId=${tipo}`);
      if (res.ok) {
        const data = await res.json();
        setLocalRecetas(
          data.map((r: any) => ({
            id: r.id,
            title: r.title,
            image: r.image_url,
            isBackend: true,
          }))
        );
      }
    } catch (e) {
      console.error("Error recetas locales:", e);
    } finally {
      setLoadingLocal(false);
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const spoonQuery = CATEGORY_SPOON_MAP[nombre as string] ?? (nombre as string).toLowerCase();
      const res = await fetch(
        `${API_BASE}/spoonacular/search?q=${encodeURIComponent(spoonQuery)}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      if (res.ok) {
        const data = await res.json();
        setSpoonRecetas(
          (data.results ?? []).map((item: any) => ({
            id: item.id,
            title: item.title,
            image: item.image,
            isBackend: false,
            isSpoonacular: true,
          }))
        );
      }
    } catch (e) {
      console.error("Error Spoonacular:", e);
    } finally {
      setLoadingSpoon(false);
    }
  };

  const allRecetas = [...localRecetas, ...spoonRecetas];
  const loading = loadingLocal || loadingSpoon;

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH, marginBottom: GAP }]}
      onPress={() =>
        router.push({
          pathname: "/receta",
          params: item.isBackend
            ? { id: String(item.id) }
            : {
                spoonacularId: String(item.id),
                spoonTitle: item.title,
                spoonImage: item.image ?? "",
                categoryId: tipo,
              },
        })
      }
    >
      <Image
        source={item.image ? { uri: item.image } : require("@/assets/images/pastel1.jpg")}
        style={styles.cardImage}
        contentFit="cover"
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 }}>
      <Stack.Screen options={{ headerTitle: "", headerShadowVisible: false, headerTransparent: true }} />
      <Text style={{ fontSize: 28, fontWeight: "bold", marginTop: 50, marginBottom: 20, color: "hsl(29, 49%, 59%)" }}>
        {nombre}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="hsl(29, 49%, 59%)" style={{ marginTop: 20 }} />
      ) : allRecetas.length === 0 ? (
        <Text style={{ color: "#aaa", textAlign: "center", marginTop: 40 }}>
          No se encontraron recetas en esta categoría.
        </Text>
      ) : (
        <>
          <Text style={{ color: "#bbb", fontSize: 12, marginBottom: 12 }}>
            {localRecetas.length} propias · {spoonRecetas.length} de Spoonacular
          </Text>
          <FlatList
            data={allRecetas}
            renderItem={renderItem}
            keyExtractor={(item) => (item.isBackend ? `local-${item.id}` : `spoon-${item.id}`)}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </>
      )}
    </View>
  );
}