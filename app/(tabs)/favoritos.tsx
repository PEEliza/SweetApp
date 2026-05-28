import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

interface RecetaFavorita {
  favoriteId: number;
  id: number;
  title: string;
  image_url: string | null;
  category: { id: number; name: string } | null;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<RecetaFavorita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const obtenerFavoritos = async () => {
        try {
          setLoading(true);
          const token = await SecureStore.getItemAsync("userToken");
          if (!token) {
            if (isMounted) setFavorites([]);
            return;
          }
          const response = await fetch(`${API_BASE}/user-favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (isMounted) setFavorites(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error al traer favoritos:", error);
          Alert.alert("Error de Conexión", "No pudimos conectar con el servidor.");
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      obtenerFavoritos();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const eliminarFavorito = (recipeId: number) => {
    Alert.alert("Eliminar favorito", "¿Quieres quitar esta receta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const token = await SecureStore.getItemAsync("userToken");
          const res = await fetch(`${API_BASE}/user-favorites/${recipeId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 204 || res.ok) {
            setFavorites((prev) => prev.filter((f) => f.id !== recipeId));
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#D4A373" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Favoritos</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes recetas favoritas guardadas.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.favoriteId.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/receta", params: { id: String(item.id) } })
              }
              onLongPress={() => eliminarFavorito(item.id)}
            >
              <Image
                source={
                  item.image_url
                    ? { uri: item.image_url }
                    : require("@/assets/images/pastel1.jpg")
                }
                style={styles.image}
                contentFit="cover"
                transition={300}
              />
              <View style={styles.info}>
                <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                {item.category && (
                  <Text numberOfLines={1} style={styles.categoryText}>
                    {item.category.name}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8F9FA" },
  center: { justifyContent: "center", alignItems: "center" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#573011", marginTop: 50 },
  card: { backgroundColor: "#fff", borderRadius: 20, marginBottom: 16, width: "48%", shadowColor: "#a85c30", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, overflow: "hidden" },
  image: { width: "100%", height: 120 },
  info: { padding: 10 },
  title: { fontSize: 14, fontWeight: "700", color: "#6e3c13", textAlign: "center" },
  categoryText: { fontSize: 11, color: "#D4A373", textAlign: "center", marginTop: 2 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999", fontSize: 16 },
});