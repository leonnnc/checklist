import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from "react-native";
import { useAuthCtx } from "../../src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const { signIn } = useAuthCtx();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Campos requeridos", "Ingresa tu correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert(
        "Error al iniciar sesión",
        e.message?.includes("invalid-credential") || e.message?.includes("wrong-password")
          ? "Correo o contraseña incorrectos."
          : e.message || "Error desconocido."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoEmoji}>🏠</Text>
        </View>
        <Text style={styles.title}>Depa 804</Text>
        <Text style={styles.subtitle}>Servicio de Limpieza</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Iniciar sesión</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color="#90a4ae" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#bdbdbd"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color="#90a4ae" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Contraseña"
            placeholderTextColor="#bdbdbd"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={18} color="#90a4ae" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Entrar</Text>
          }
        </TouchableOpacity>

        <Text style={styles.hint}>
          Solo usuarios autorizados pueden acceder
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a237e", justifyContent: "center", paddingHorizontal: 24 },
  header: { alignItems: "center", marginBottom: 40 },
  logoWrap: { width: 72, height: 72, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  logoEmoji: { fontSize: 36 },
  title: { color: "#fff", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#c5cae9", fontSize: 14, marginTop: 4 },
  form: { backgroundColor: "#fff", borderRadius: 24, padding: 24 },
  formTitle: { fontSize: 18, fontWeight: "700", color: "#1a237e", marginBottom: 20 },
  inputWrap: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, paddingHorizontal: 12, marginBottom: 14, backgroundColor: "#fafafa" },
  inputIcon: { marginRight: 8 },
  input: { height: 48, fontSize: 15, color: "#212121", flex: 1 },
  eyeBtn: { padding: 4 },
  btn: { backgroundColor: "#1a237e", borderRadius: 14, height: 52, justifyContent: "center", alignItems: "center", marginTop: 6, elevation: 3 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  hint: { textAlign: "center", color: "#bdbdbd", fontSize: 12, marginTop: 16 },
});
