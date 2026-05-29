import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { API_ROUTES } from "@/constants/api";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert("Campo vacío", "Por favor ingresa un nombre de usuario y correo.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert("Contraseña inválida", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json();
      if (res.status === 201 || res.ok) {
        Alert.alert(
          "¡Registro exitoso!",
          "Tu cuenta fue creada. Ahora puedes iniciar sesión.",
          [{ text: "Ir al login", onPress: () => router.replace("/login") }]
        );
      } else if (res.status === 409) {
        Alert.alert("Email en uso", "Ya existe una cuenta con ese correo.");
      } else {
        Alert.alert("Error", data.error ?? "No se pudo crear la cuenta.");
      }
    } catch {
      Alert.alert("Error de conexión", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconBox}>
          <Ionicons name="restaurant" size={50} color="white" />
        </View>
        <Text style={styles.title}>Sweet</Text>
        <Text style={styles.subtitle}>REGISTRAR CUENTA</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>NOMBRE DE USUARIO</Text>
        <TextInput
          style={styles.input}
          placeholder="dani_chef"
          placeholderTextColor="#a09080"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={styles.input}
          placeholder="dani_chef@gmail.com"
          placeholderTextColor="#a09080"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CONTRASEÑA</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#a09080"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Registrarse</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")} style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={styles.label}>
          ¿Ya tienes cuenta? <Text style={{ color: "#d6834c" }}>Inicia Sesión</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfaf6", padding: 30, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  iconBox: { backgroundColor: "#d6834c", padding: 20, borderRadius: 25, marginBottom: 15 },
  title: { fontSize: 42, fontWeight: "bold", color: "#b58d63" },
  subtitle: { fontSize: 12, color: "#888", letterSpacing: 2, marginTop: 5 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: "bold", color: "#8b5e3c", marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: "#f5f0eb", padding: 15, borderRadius: 12, fontSize: 16, color: "#333" },
  button: { backgroundColor: "#d6834c", padding: 18, borderRadius: 15, alignItems: "center", marginTop: 20 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});