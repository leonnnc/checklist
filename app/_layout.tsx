import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AuthContextProvider, useAuthCtx } from "../src/context/AuthContext";

function RootNavigator() {
  const { user, profile, loading } = useAuthCtx();
  const router   = useRouter();
  const segments = useSegments();
  const [introListo, setIntroListo] = useState(false); // intro siempre al abrir

  useEffect(() => {
    if (loading) return;

    const inAuth  = segments[0] === "(auth)";
    const inIntro = segments[0] === "intro";
    const inTabs  = segments[0] === "(tabs)";
    const inChecklist = segments[0] === "checklist";

    // 1. Siempre mostrar intro primero al abrir
    if (!introListo && !inIntro) {
      router.replace("/intro");
      return;
    }

    // 2. Ya terminó el intro
    if (introListo) {
      if (user && profile && (inAuth || inIntro)) {
        // Usuario ya logueado → ir al dashboard directo
        router.replace("/(tabs)");
      } else if (!user && !inAuth) {
        // Sin sesión → ir al login
        router.replace("/(auth)/login");
      }
    }
  }, [user, profile, loading, segments, introListo]);

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
        <Stack.Screen name="intro"  options={{ headerShown: false }} />
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

// Exportamos setIntroListo para que intro.tsx lo llame al terminar
export let marcarIntroListo: () => void = () => {};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <RootNavigatorWrapper />
    </AuthContextProvider>
  );
}

function RootNavigatorWrapper() {
  const [introListo, setIntroListo] = useState(false);
  marcarIntroListo = () => setIntroListo(true);
  return <RootNavigatorInner introListo={introListo} />;
}

function RootNavigatorInner({ introListo }: { introListo: boolean }) {
  const { user, profile, loading } = useAuthCtx();
  const router   = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuth  = segments[0] === "(auth)";
    const inIntro = segments[0] === "intro";

    if (!introListo && !inIntro) {
      router.replace("/intro");
      return;
    }

    if (introListo) {
      if (user && profile && (inAuth || inIntro)) {
        router.replace("/(tabs)");
      } else if (!user && !inAuth) {
        router.replace("/(auth)/login");
      }
    }
  }, [user, profile, loading, segments, introListo]);

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
        <Stack.Screen name="intro"  options={{ headerShown: false }} />
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
