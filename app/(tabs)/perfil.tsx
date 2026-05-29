import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../_layout";

import { API_ROUTES } from "@/constants/api";

interface PerfilUsuario {
  username: string;
  email: string;
  createdAt: string;
  profile?: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
}

export default function Perfil() {
  const { logout } = useAuth();
  const [usuario, setUsuario] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [favoritosCount, setFavoritosCount] = useState(0);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const token = await SecureStore.getItemAsync("userToken");
        if (!token) {
          router.replace("/login");
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const [perfilRes, favsRes] = await Promise.all([
          fetch(API_ROUTES.auth.me, { headers }),
          fetch(API_ROUTES.favorites.getAll, { headers }),
        ]);

        if (perfilRes.ok) setUsuario(await perfilRes.json());
        if (favsRes.ok) {
          const favs = await favsRes.json();
          setFavoritosCount(Array.isArray(favs) ? favs.length : 0);
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        Alert.alert("Error", "No se pudieron obtener los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, []);

  const cerrarSesion = () => {
    Alert.alert("Cerrar sesión", "¿Estás segura de que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("userToken");
          await SecureStore.deleteItemAsync("userId");
          await SecureStore.deleteItemAsync("username");
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#96552a" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>No se pudo cargar la información de la cuenta.</Text>
      </View>
    );
  }

  const avatarUrl = usuario.profile?.avatarUrl;
  const fullName =
    usuario.profile?.firstName || usuario.profile?.lastName
      ? `${usuario.profile?.firstName ?? ""} ${usuario.profile?.lastName ?? ""}`.trim()
      : null;

  const fechaRegistro = new Date(usuario.createdAt).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
        )}
        <Text style={styles.username}>{usuario.username}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{favoritosCount}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información de la Cuenta</Text>
        <InfoItem label="Nombre" value={fullName ?? usuario.username} />
        <InfoItem label="Correo" value={usuario.email} />
        <InfoItem label="Miembro desde" value={fechaRegistro} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={cerrarSesion}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#96552a", paddingTop: 70, paddingBottom: 40, alignItems: "center", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: "#FFF", marginBottom: 15 },
  avatarPlaceholder: { backgroundColor: "#f0d9c5", justifyContent: "center", alignItems: "center" },
  username: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  email: { marginTop: 5, color: "#FFF", fontSize: 14 },
  statsRow: { flexDirection: "row", marginTop: 16, gap: 32 },
  statItem: { alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "bold", color: "#FFF" },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  card: { backgroundColor: "#ffffff", marginHorizontal: 20, marginTop: -20, borderRadius: 20, padding: 20, elevation: 4 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#61401b" },
  infoItem: { marginBottom: 18, borderBottomWidth: 1, borderBottomColor: "#EEE", paddingBottom: 10 },
  label: { fontSize: 13, color: "#888", marginBottom: 3 },
  value: { fontSize: 16, color: "#222", fontWeight: "500" },
  buttonsContainer: { marginTop: 30, paddingHorizontal: 20, paddingBottom: 100 },
  button: { paddingVertical: 15, borderRadius: 15, alignItems: "center", marginBottom: 15, borderWidth: 2, borderColor: "#855621", backgroundColor: "transparent" },
  logoutButton: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#5a330f" },
  logoutText: { color: "#5a330f", fontSize: 16, fontWeight: "bold" },
});