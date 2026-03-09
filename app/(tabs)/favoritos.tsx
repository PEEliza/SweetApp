// Esta sección de favoritos usa el AsyncSorgae que es de frorma local pero esta pensado para cambiarlo con la base de datos
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

// El diccionario para poder mostrarlo (aqui hay que moverlo para la base de datos y que no esten local )
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

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);

  // useFocusEffect hace que la lista se actualice cada vez que vuelves a esta pantalla
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const stored = await AsyncStorage.getItem("mis_favoritos");
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      };
      loadFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Favoritos</Text>
      {favorites.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Aún no tienes recetas guardadas.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.title}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={images[item.title]} style={styles.image} />
              <View style={styles.info}>
                <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8F9FA" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#573011", marginTop: 30 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    width: '48%', // Para que queden dos por fila con espacio( aqui es para verlo más visual y no verlo como lista)
    shadowColor: "#a85c30",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden' // Paara que tengan curvas mis imagenes 
  },
  image: { width: "100%", height: 120, resizeMode: "cover" },
  info: { padding: 10 },
  title: { fontSize: 14, fontWeight: "700", color: "#6e3c13", textAlign: 'center' },
});