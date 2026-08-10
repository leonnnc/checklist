import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContextProvider, useAuthCtx } from "../src/context/AuthContext";

function RootNavigator() {
  const { user, profile, loading } = useAuthCtx();
  const router   = useRouter();
  const segments = useSegments();
  const [introVista, setIntroVista] = useState<boolean | null>(null);

  // Verificar si el intro ya se mostró en esta instalación
  useEffect(() => {
    AsyncStorage.getItem("introVista").then(val => {
      setIntroVista(val === "true");
    });
  }, []);

  useEffect(() => {
    if (loading || introVista === null) return;

    const inAuth  = segments[0] === "(auth)";
    const inIntro = segments[0] === "intro";
    const inTabs  = segments[0] === "(tabs)";

    // Primera vez — mostrar intro
    if (!introVista && !inIntro) {
      router.replace("/intro");
      return;
    }

    // Ya vio el intro
    if (introVista) {
      if (!user && !inAuth) {
        router.replace("/(auth)/login");
      } else if (user && profile && (inAuth || inIntro)) {
        router.replace("/(tabs)");
      }
    }
  }, [user, profile, loading, segments, introVista]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1a237e" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="intro"   options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="(auth)"  options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
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
