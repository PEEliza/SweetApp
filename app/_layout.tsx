import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Solo leer SecureStore al arrancar — sin fetch al backend
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const username = await SecureStore.getItemAsync("username");
        if (token && username) {
          setUser(username);
        }
      } catch {
        // Sin acceso a SecureStore — arrancar sin sesión
      } finally {
        setMounted(true);
      }
    };
    restoreSession();
  }, []);

  // Redirección — solo depende de user y mounted, NO de segments
  // para evitar el loop infinito
  useEffect(() => {
    if (!mounted) return;

    const inAuthGroup =
      segments[0] === "login" || segments[0] === "register";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, mounted]);

  if (!mounted) return null;

  const login = async (username: string, token: string) => {
    await SecureStore.setItemAsync("userToken", token);
    await SecureStore.setItemAsync("username", username);
    setUser(username); // esto dispara el useEffect y redirige a /(tabs)
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("userId");
    setUser(null); // esto dispara el useEffect y redirige a /login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthContext.Provider>
  );
}