import NavBar from "@/components/navBar";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { imageStyles } from "@/constants/imageStyles";
import { styles } from "@/constants/StyleSheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const GAP = 16;
// Eliminamos el PADDING_SCREEN  para que ocupen todo el ancho
const CARD_WIDTH = (width - GAP) / 2;
const PADDING_INTERNO_SCREEN = 20; // (El padding que suele traer el Parallax por defecto)

export default function HomeScreen() {
  const renderCard = (title: string, imageSource: any) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/receta",
          params: { title },
        })
      }
    >
      <View style={[styles.card, { width: CARD_WIDTH }]}>
        <Image source={imageSource} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

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
            marginLeft: 0, // Ajustado a 0 porque el contenedor ya tiene padding
            color: "hsl(29, 49%, 59%)",
          }}
        >
          Pasteles
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 10,
            // ESTO ELIMINA LOS BORDES LATERALES
            marginHorizontal: -PADDING_INTERNO_SCREEN,
          }}
          contentContainerStyle={{
            // Añade espacio solo al inicio y final del scroll interno
            paddingHorizontal: PADDING_INTERNO_SCREEN,
            gap: GAP,
          }}
        >
          {renderCard("Red velvet", require("@/assets/images/pastel1.jpg"))}
          {renderCard("Chocolate", require("@/assets/images/pastel2.jpg"))}
          {renderCard("Vainilla", require("@/assets/images/pastel3jpg.jpg"))}
          {renderCard("Fresa Crema", require("@/assets/images/pastel4.jpg"))}
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
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Ver más
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
          Pays
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
          {renderCard("Pay de Queso", require("@/assets/images/payQueso.jpg"))}
          {renderCard("Pay de Limón", require("@/assets/images/payLimon.jpg"))}
          {renderCard("Pay de Manzana", require("@/assets/images/payManzana.jpg"),)}
          {renderCard("Pay Frutal", require("@/assets/images/payFrutal.jpg"))}
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
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Ver más
          </Text>
        </TouchableOpacity>
      </View>
      {/* Sección Galletas*/}
      <View style={{ marginTop: 25, marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: 0,
            color: "hsl(29, 49%, 59%)",
          }}
        >
          Galletas
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
          {renderCard("Galleta de chocolate", require("@/assets/images/galletaChoco.jpg"),)}
          {renderCard("Galleta Red velvet", require("@/assets/images/GalletaRed.jpg"),)}
          {renderCard("Galleta Biscoff", require("@/assets/images/galletaBiscoff.jpg"),)}
          {renderCard("Galleta Pistacho Choco", require("@/assets/images/galletaPistacho.jpg"),)}
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
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Ver más
          </Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}
