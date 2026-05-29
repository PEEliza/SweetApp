import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { API_ROUTES } from "@/constants/api";

interface Category {
  id: number;
  name: string;
}

export default function CrearRecetaScreen() {
  const [nombre, setNombre] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredientes, setIngredientes] = useState("");
  const [preparacion, setPreparacion] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(API_ROUTES.categories.getAll)
      .then((r) => r.json())
      .then((data: Category[]) => {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      })
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const parsearIngredientes = () =>
    ingredientes
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [name, quantity] = l.split(",");
        return { name: name?.trim() ?? l, quantity: quantity?.trim() ?? "" };
      });

  const parsearPasos = () =>
    preparacion
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((instruction, i) => ({ stepNumber: i + 1, instruction }));

  const guardarReceta = async () => {
    if (!nombre || !ingredientes || !preparacion) {
      Alert.alert("¡Ups!", "Por favor llena todos los campos antes de hornear.");
      return;
    }
    if (!categoryId) {
      Alert.alert("¡Ups!", "Selecciona una categoría.");
      return;
    }

    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      Alert.alert("Sesión requerida", "Debes iniciar sesión para guardar recetas.", [
        { text: "Ir al login", onPress: () => router.replace("/login") },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.recipes.create, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: nombre.trim(),
          categoryId,
          imageUrl: imagen ?? null,
          ingredients: parsearIngredientes(),
          steps: parsearPasos(),
        }),
      });

      if (res.status === 201 || res.ok) {
        const saved = await res.json();
        Alert.alert("¡Éxito!", "Tu receta se ha guardado correctamente.", [
          {
            text: "Ver receta",
            onPress: () =>
              router.push({ pathname: "/receta", params: { id: String(saved.id) } }),
          },
          {
            text: "Crear otra",
            onPress: () => {
              setNombre("");
              setIngredientes("");
              setPreparacion("");
              setImagen(null);
            },
          },
        ]);
      } else if (res.status === 401) {
        Alert.alert("Sesión expirada", "Inicia sesión nuevamente.");
        router.replace("/login");
      } else {
        const err = await res.json();
        Alert.alert("Error", err.message ?? "No se pudo guardar la receta.");
      }
    } catch {
      Alert.alert("Error de conexión", "Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.header}>Nueva Creación</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre de la receta:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Pastel de Elote"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Categoría:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(val) => setCategoryId(val)}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Ingredientes:</Text>
        <Text style={styles.hint}>Un ingrediente por línea. Ej: Harina, 2 tazas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={"Harina, 2 tazas\nAzúcar, 1 taza\nHuevos, 3 piezas"}
          multiline
          numberOfLines={4}
          value={ingredientes}
          onChangeText={setIngredientes}
        />

        <Text style={styles.label}>Preparación:</Text>
        <Text style={styles.hint}>Un paso por línea. Se numerarán automáticamente.</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={"Mezclar ingredientes secos.\nAgregar los líquidos.\nHornear a 180°C por 30 min."}
          multiline
          numberOfLines={6}
          value={preparacion}
          onChangeText={setPreparacion}
        />

        <Text style={styles.label}>Foto de la receta:</Text>
        <TouchableOpacity style={styles.imagePickerBtn} onPress={seleccionarImagen}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={40} color="#D4A373" />
              <Text style={{ color: "#D4A373" }}>Toca para subir foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.7 }]}
          onPress={guardarReceta}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Guardar Receta</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 28, fontWeight: "bold", color: "#573011", marginTop: 60, textAlign: "center" },
  form: { padding: 25 },
  label: { fontSize: 16, fontWeight: "600", color: "#D4A373", marginBottom: 8, marginTop: 15 },
  hint: { fontSize: 12, color: "#aaa", marginBottom: 8, marginTop: -4 },
  input: { backgroundColor: "#F9F9F9", borderRadius: 12, padding: 15, fontSize: 16, borderWidth: 1, borderColor: "#EEE", color: "#333" },
  textArea: { textAlignVertical: "top", minHeight: 100 },
  pickerContainer: { backgroundColor: "#F9F9F9", borderRadius: 12, borderWidth: 1, borderColor: "#EEE", overflow: "hidden" },
  picker: { height: 50, width: "100%" },
  imagePickerBtn: { marginTop: 10, height: 200, borderRadius: 20, backgroundColor: "#FDFBF7", borderWidth: 2, borderColor: "#D4A373", borderStyle: "dashed", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  previewImage: { width: "100%", height: "100%" },
  placeholder: { alignItems: "center" },
  saveBtn: { backgroundColor: "hsl(29, 49%, 59%)", borderRadius: 12, padding: 18, marginTop: 30, alignItems: "center", elevation: 4 },
  saveBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});