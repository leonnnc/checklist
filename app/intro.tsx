import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
  StatusBar, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SERVICIOS = [
  { icono: 'tv-outline',          label: 'Limpieza de la Sala',              color: '#3f51b5' },
  { icono: 'restaurant-outline',  label: 'Limpieza de la Cocina',            color: '#e65100' },
  { icono: 'bed-outline',         label: 'Habitación Principal',             color: '#7b1fa2' },
  { icono: 'bed-outline',         label: 'Habitación Mediana',               color: '#ad1457' },
  { icono: 'bed-outline',         label: 'Habitación Pequeña',               color: '#c62828' },
  { icono: 'water-outline',       label: 'Lavatorio',                        color: '#0277bd' },
  { icono: 'water-outline',       label: 'Baño Principal',                   color: '#00897b' },
  { icono: 'water-outline',       label: 'Baño Secundario',                  color: '#00695c' },
  { icono: 'pizza-outline',       label: 'Limpieza del Comedor',             color: '#f57f17' },
  { icono: 'shirt-outline',       label: 'Lavandería',                       color: '#546e7a' },
  { icono: 'archive-outline',     label: 'Almacén',                          color: '#4e342e' },
  { icono: 'leaf-outline',        label: 'Terraza / Balcón',                 color: '#2e7d32' },
  { icono: 'car-outline',         label: 'Estacionamiento',                  color: '#37474f' },
];

export default function IntroScreen() {
  const router = useRouter();

  // Animaciones
  const logoOpacity   = useRef(new Animated.Value(0)).current;
  const logoScale     = useRef(new Animated.Value(0.6)).current;
  const titleOpacity  = useRef(new Animated.Value(0)).current;
  const titleY        = useRef(new Animated.Value(30)).current;
  const listOpacity   = useRef(new Animated.Value(0)).current;
  const btnOpacity    = useRef(new Animated.Value(0)).current;
  const scrollAnim    = useRef(new Animated.Value(0)).current;
  const scrollRef     = useRef<ScrollView>(null);

  const [autoScroll, setAutoScroll] = useState(false);

  useEffect(() => {
    // 1. Logo aparece
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(logoScale,   { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      // 2. Título aparece
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(titleY,       { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      // 3. Lista aparece
      Animated.timing(listOpacity, { toValue: 1, duration: 600, useNativeDriver: true, delay: 200 }),
    ]).start(() => {
      setAutoScroll(true);
      // 4. Botón aparece
      Animated.timing(btnOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    });
  }, []);

  // Auto scroll suave de los servicios
  useEffect(() => {
    if (!autoScroll) return;
    let offset = 0;
    const totalHeight = SERVICIOS.length * 60;
    const interval = setInterval(() => {
      offset += 1;
      if (offset > totalHeight) offset = 0;
      scrollRef.current?.scrollTo({ y: offset, animated: false });
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />

      {/* Fondo decorativo */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Text style={styles.logoEmoji}>🏠</Text>
      </Animated.View>

      {/* Título */}
      <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }], alignItems: 'center' }}>
        <Text style={styles.titulo}>Depa 804</Text>
        <Text style={styles.subtitulo}>Servicio Profesional de Limpieza</Text>
        <View style={styles.divider} />
        <Text style={styles.labelServicios}>Nuestros servicios incluyen</Text>
      </Animated.View>

      {/* Lista de servicios con scroll automático */}
      <Animated.View style={[styles.listaWrap, { opacity: listOpacity }]}>
        <ScrollView
          ref={scrollRef}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          style={styles.lista}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {/* Duplicar para efecto infinito */}
          {[...SERVICIOS, ...SERVICIOS].map((s, i) => (
            <View key={i} style={styles.servicioRow}>
              <View style={[styles.servicioIcono, { backgroundColor: s.color + '22' }]}>
                <Ionicons name={s.icono as any} size={18} color={s.color} />
              </View>
              <Text style={styles.servicioLabel}>{s.label}</Text>
              <View style={[styles.servicioDot, { backgroundColor: s.color }]} />
            </View>
          ))}
        </ScrollView>

        {/* Degradados arriba y abajo para efecto de fade */}
        <View style={styles.fadeTop} pointerEvents="none" />
        <View style={styles.fadeBottom} pointerEvents="none" />
      </Animated.View>

      {/* Botón entrar */}
      <Animated.View style={{ opacity: btnOpacity, width: '100%', paddingHorizontal: 32 }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            await AsyncStorage.setItem('introVista', 'true');
            router.replace('/(auth)/login');
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.btnTexto}>Comenzar</Text>
          <Ionicons name="arrow-forward" size={20} color="#1a237e" />
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.version}>v1.0 · Depa 804</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  // Círculos decorativos
  circle1: {
    position: 'absolute', width: 400, height: 400,
    borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.04)',
    top: -100, right: -100,
  },
  circle2: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -50, left: -80,
  },
  // Logo
  logoWrap: {
    width: 90, height: 90, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, elevation: 10,
  },
  logoEmoji: { fontSize: 48 },
  // Títulos
  titulo: {
    fontSize: 38, fontWeight: '900', color: '#fff',
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 14, color: '#c5cae9', marginTop: 4, letterSpacing: 0.5,
  },
  divider: {
    width: 50, height: 3, backgroundColor: '#5c6bc0',
    borderRadius: 2, marginVertical: 16,
  },
  labelServicios: {
    fontSize: 11, color: '#9fa8da', letterSpacing: 2,
    textTransform: 'uppercase', marginBottom: 12,
  },
  // Lista
  listaWrap: {
    width: width - 48,
    height: 200,
    marginVertical: 8,
    position: 'relative',
  },
  lista: { flex: 1 },
  servicioRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 4,
    height: 48,
  },
  servicioIcono: {
    width: 32, height: 32, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  servicioLabel: {
    flex: 1, fontSize: 15, color: '#e8eaf6', fontWeight: '500',
  },
  servicioDot: {
    width: 6, height: 6, borderRadius: 3, opacity: 0.7,
  },
  // Degradados
  fadeTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 40,
    backgroundColor: 'transparent',
    // Efecto con borderTopColor no funciona en RN, usamos overlay
    borderTopWidth: 40, borderTopColor: '#1a237e',
    borderLeftWidth: 0, borderRightWidth: 0,
  },
  fadeBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
    borderBottomWidth: 40, borderBottomColor: '#1a237e',
    borderLeftWidth: 0, borderRightWidth: 0,
  },
  // Botón
  btn: {
    backgroundColor: '#fff',
    borderRadius: 18, height: 56,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 16,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5,
  },
  btnTexto: {
    fontSize: 17, fontWeight: '800', color: '#1a237e',
  },
  version: {
    color: '#3949ab', fontSize: 11, marginTop: 20,
  },
});
