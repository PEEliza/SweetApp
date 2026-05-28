import {
  Stack,
  useRouter,
  useSegments,
} from "expo-router";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: string | null;
  login: (u: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [user, setUser] =
    useState<string | null>(null);

  const [mounted, setMounted] =
    useState(false);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "register";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, segments, mounted]);

  if (!mounted) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (u) => setUser(u),
        logout: () => setUser(null),
      }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
      </Stack>

    </AuthContext.Provider>
  );
}