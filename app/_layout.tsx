import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthContextProvider, useAuthCtx } from "../src/context/AuthContext";

function RootNavigator() {
  const { user, profile, loading } = useAuthCtx();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "(auth)";
    if (!user && !inAuth) {
      router.replace("/(auth)/login");
    } else if (user && profile && inAuth) {
      router.replace("/(tabs)");
    }
  }, [user, profile, loading, segments]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1a237e" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="checklist/[grupoId]/[ambienteId]"
          options={{
            headerStyle: { backgroundColor: "#1a237e" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <RootNavigator />
    </AuthContextProvider>
  );
}
