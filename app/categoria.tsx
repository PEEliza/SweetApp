// app/categoria.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { buscarRecetas, obtenerRecetas, Receta } from '../types/recetas.service';

export default function CategoriaScreen() {
  const { categoria } = useLocalSearchParams();
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarRecetas = async () => {
      setCargando(true);
      let datos: Receta[] = [];
      
      if (categoria === 'Cake' || categoria === 'Cookie') {
        datos = await buscarRecetas(categoria.toLowerCase());
      } else {
        datos = await obtenerRecetas(categoria as string);
      }
      
      setRecetas(datos);
      setCargando(false);
    };
    
    cargarRecetas();
  }, [categoria]);

  const renderCard = ({ item }: { item: Receta }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: "/receta",
        params: { id: item.id, title: item.title, image: item.image }
      })}
    >
      <Image source={{ uri: item.image + '/preview' }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={recetas}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      ListHeaderComponent={() => (
        <Text style={styles.header}>🍽️ {recetas.length} recetas encontradas</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#573011',
    marginTop: 5,
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4A373',
    textAlign: 'center',
    marginVertical: 10,
  },
});