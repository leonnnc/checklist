import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { marcarIntroListo } from './_layout';

const SERVICIOS = [
  'Limpieza de la Sala',
  'Limpieza de la Cocina',
  'Habitación Principal',
  'Habitación Mediana',
  'Habitación Pequeña',
  'Lavatorio',
  'Baño Principal',
  'Baño Secundario',
  'Comedor',
  'Lavandería',
  'Almacén General',
  'Terraza',
  'Estacionamiento',
];

export default function IntroScreen() {
  const [indice, setIndice] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let i = 0;
    const run = () => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        i++;
        if (i >= SERVICIOS.length) {
          marcarIntroListo();
          return;
        }
        setIndice(i);
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        setTimeout(run, 400);
      });
    };
    const t = setTimeout(run, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1b5e" />

      {/* UNA SOLA LÍNEA HORIZONTAL */}
      <View style={s.row}>
        <Text style={s.titulo}>DEPA 804</Text>
        <Text style={s.sep}> | </Text>
        <Animated.Text style={[s.servicio, { opacity }]}>
          {SERVICIOS[indice]}
        </Animated.Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b5e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
  },
  sep: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  servicio: {
    fontSize: 18,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.85)',
    flexShrink: 1,
  },
});
