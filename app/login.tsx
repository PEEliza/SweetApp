import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
import { useAuth } from "./_layout";

import { API_ROUTES } from "@/constants/api";
  
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos vacíos", "Por por favor completa todas las credenciales.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        await SecureStore.setItemAsync("userToken", data.token);
        await SecureStore.setItemAsync("username", data.user.username);
        await SecureStore.setItemAsync("userId", String(data.user.id));
        login(data.user.username, data.token);
      } else {
        Alert.alert("Error al iniciar sesión", data.error ?? "Credenciales inválidas.");
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
          <MaterialCommunityIcons name="cupcake" size={50} color="white" />
        </View>
        <Text style={styles.title}>Sweet</Text>
        <Text style={styles.subtitle}>REPOSTERÍA ARTESANAL</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={styles.input}
          placeholder="chef@sweetapp.com"
          placeholderTextColor="#a09080"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CONTRASEÑA</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: "transparent" }]}
            placeholder="********"
            placeholderTextColor="#a09080"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={styles.label}>
          ¿No tienes cuenta? <Text style={{ color: "#d6834c" }}>Registrarte</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfaf6", padding: 30, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 50 },
  iconBox: { backgroundColor: "#d6834c", padding: 20, borderRadius: 25, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  title: { fontSize: 42, fontWeight: "bold", color: "#b58d63" },
  subtitle: { fontSize: 12, color: "#888", letterSpacing: 2, marginTop: 5 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 11, fontWeight: "bold", color: "#8b5e3c", marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: "#f5f0eb", padding: 15, borderRadius: 12, fontSize: 16, color: "#333" },
  passwordContainer: { backgroundColor: "#f5f0eb", borderRadius: 12, flexDirection: "row", alignItems: "center" },
  button: { backgroundColor: "#d6834c", padding: 18, borderRadius: 15, alignItems: "center", marginTop: 20, shadowColor: "#d6834c", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});