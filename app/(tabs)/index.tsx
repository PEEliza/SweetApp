import NavBar from "@/components/navBar";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { imageStyles } from "@/constants/imageStyles";
import { styles } from "@/constants/StyleSheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//El import jala las recetas de la api :)
import { buscarRecetas, obtenerRecetas, Receta } from '../../types/recetas.service';



const { width } = Dimensions.get("window");
const GAP = 16;
const CARD_WIDTH = (width - GAP) / 2;
const PADDING_INTERNO_SCREEN = 20;

export default function HomeScreen() {
  // Estados para cada categoría
  const [pasteles, setPasteles] = useState<Receta[]>([]);
  const [pays, setPays] = useState<Receta[]>([]);
  const [galletas, setGalletas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarTodasLasRecetas = async () => {
      setCargando(true);
      
      // Cargar diferentes categorías
      const [desserts, cakes, cookies] = await Promise.all([
        obtenerRecetas('Dessert'),     // Postres en general
        buscarRecetas('cake'),          // Búsqueda de pasteles
        buscarRecetas('cookie'),        // Búsqueda de galletas
      ]);
      
      // Limitar a 4 recetas por categoría para mantener el diseño
      setPasteles(cakes.slice(0, 4));
      setPays(desserts.slice(0, 4));    // Temporalmente para pays
      setGalletas(cookies.slice(0, 4));
      
      setCargando(false);
    };

    cargarTodasLasRecetas();
  }, []);

  const renderCard = (item: Receta) => (
    <TouchableOpacity
      key={item.id}
      onPress={() =>
        router.push({
          pathname: "/receta",
          params: { 
            id: item.id,
            title: item.title,
            image: item.image 
          },
        })
      }
    >
      <View style={[styles.card, { width: CARD_WIDTH }]}>
        <Image 
          source={{ uri: item.image + '/preview' }} 
          style={styles.cardImage} 
        />
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Renderizado condicional mientras carga
  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="hsl(29, 49%, 59%)" />
        <Text style={{ marginTop: 10 }}>Cargando deliciosas recetas...</Text>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#f8d6af", dark: "#d8c3a3" }}
      headerImage={
        <View style={imageStyles.headerImageContainer}>
          <Image
            source={require("@/assets/images/homepastel.jpg")}
            style={imageStyles.headerImage}
          />
          <NavBar />
        </View>
      }
    >
      {/* Sección Pasteles */}
      <View style={{ marginTop: .3 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: 0,
            color: "hsl(29, 49%, 59%)",
          }}
        >
          Pasteles 🎂
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 10,
            marginHorizontal: -PADDING_INTERNO_SCREEN,
          }}
          contentContainerStyle={{
            paddingHorizontal: PADDING_INTERNO_SCREEN,
            gap: GAP,
          }}
        >
          {pasteles.length > 0 ? (
            pasteles.map(renderCard)
          ) : (
            <Text>No hay pasteles disponibles</Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={{
            marginTop: .02,
            alignSelf: "center",
            backgroundColor: "hsl(29, 49%, 59%)",
            paddingVertical: 10,
            paddingHorizontal: 48,
            borderRadius: 8,
          }}
          onPress={() => router.push({ pathname: "/categoria", params: { categoria: "Cake" } })}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Ver más pasteles
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección Pays */}
      <View style={{ marginTop: 25, marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: 0,
            color: "hsl(29, 49%, 59%)",
          }}
        >
          Pays y Postres 🥧
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 10,
            marginHorizontal: -PADDING_INTERNO_SCREEN,
          }}
          contentContainerStyle={{
            paddingHorizontal: PADDING_INTERNO_SCREEN,
            gap: GAP,
          }}
        >
          {pays.length > 0 ? (
            pays.map(renderCard)
          ) : (
            <Text>No hay pays disponibles</Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={{
            marginTop: 3,
            alignSelf: "center",
            backgroundColor: "hsl(29, 49%, 59%)",
            paddingVertical: 10,
            paddingHorizontal: 48,
            borderRadius: 8,
          }}
          onPress={() => router.push({ pathname: "/categoria", params: { categoria: "Dessert" } })}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Ver más postres
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección Galletas */}
      <View style={{ marginTop: 25, marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: 0,
            color: "hsl(29, 49%, 59%)",
          }}
        >
          Galletas 🍪
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 10,
            marginHorizontal: -PADDING_INTERNO_SCREEN,
          }}
          contentContainerStyle={{
            paddingHorizontal: PADDING_INTERNO_SCREEN,
            gap: GAP,
          }}
        >
          {galletas.length > 0 ? (
            galletas.map(renderCard)
          ) : (
            <Text>No hay galletas disponibles</Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={{
            marginTop: 3,
            alignSelf: "center",
            backgroundColor: "hsl(29, 49%, 59%)",
            paddingVertical: 10,
            paddingHorizontal: 48,
            borderRadius: 8,
          }}
          onPress={() => router.push({ pathname: "/categoria", params: { categoria: "Cookie" } })}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Ver más galletas
          </Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}