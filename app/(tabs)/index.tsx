import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthCtx } from '../../src/context/AuthContext';
import { getGrupo, suscribirProgresoUsuario, resetProgresoUsuario } from '../../src/firebase/firestore';
import type { Grupo, ProgresoTarea, Ambiente } from '../../src/types/firebase';

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAuthCtx();
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [progresos, setProgresos] = useState<ProgresoTarea[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar grupo del usuario y suscribirse al progreso
  useEffect(() => {
    if (!profile?.grupoId) return;

    getGrupo(profile.grupoId).then(g => {
      setGrupo(g);
      setLoading(false);
    });

    const unsub = suscribirProgresoUsuario(user!.uid, profile.grupoId, setProgresos);
    return unsub;
  }, [profile?.grupoId]);

  function getProgreso(ambienteId: string) {
    if (!grupo) return { total: 0, completadas: 0, pct: 0 };
    const amb = grupo.ambientes?.find(a => a.id === ambienteId);
    if (!amb) return { total: 0, completadas: 0, pct: 0 };
    const todasTareas = (amb.secciones || []).flatMap(s => s.tareas || []);
    const total = todasTareas.length;
    const completadas = progresos.filter(p => p.ambienteId === ambienteId && p.completado).length;
    const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { total, completadas, pct };
  }

  function getProgresoGlobal() {
    if (!grupo) return { total: 0, completadas: 0, pct: 0 };
    const total = (grupo.ambientes || []).flatMap(a => (a.secciones || []).flatMap(s => s.tareas || [])).length;
    const completadas = progresos.filter(p => p.completado).length;
    const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { total, completadas, pct };
  }

  async function handleReset() {
    Alert.alert('Reiniciar checklist', '¿Marcar todas las tareas como pendientes?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Reiniciar', style: 'destructive',
        onPress: async () => {
          await resetProgresoUsuario(user!.uid, profile!.grupoId);
        }
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text style={styles.loadingText}>Cargando tu servicio...</Text>
      </View>
    );
  }

  if (!grupo) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#e57373" />
        <Text style={styles.errorTitle}>Sin grupo asignado</Text>
        <Text style={styles.errorSub}>Contacta al administrador para que te asigne un grupo.</Text>
        <TouchableOpacity style={styles.btnSalir} onPress={signOut}>
          <Text style={styles.btnSalirTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const global = getProgresoGlobal();
  const ambientes: Ambiente[] = grupo.ambientes || [];

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>🏠 Depa 804</Text>
            <Text style={styles.headerSub}>Hola, {profile?.nombre?.split(' ')[0]}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleReset} style={styles.headerBtn}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} style={styles.headerBtn}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Badge del grupo */}
        <View style={[styles.grupoBadge, { backgroundColor: grupo.color + '33' }]}>
          <View style={[styles.grupoDot, { backgroundColor: grupo.color }]} />
          <Text style={[styles.grupoTexto, { color: grupo.color }]}>{grupo.nombre}</Text>
        </View>
      </View>

      {/* Resumen global */}
      <View style={styles.resumenContainer}>
        <Text style={styles.resumenTexto}>
          {ambientes.length} ambientes · {global.completadas}/{global.total} tareas
        </Text>
        <View style={styles.barraFondo}>
          <View style={[styles.barraRelleno, { width: `${global.pct}%` as any }]} />
        </View>
        <Text style={styles.resumenPct}>{global.pct}% completado</Text>
      </View>

      {/* Lista de ambientes */}
      <FlatList
        data={ambientes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const { total, completadas, pct } = getProgreso(item.id);
          return (
            <TouchableOpacity
              style={[styles.card, { borderLeftColor: item.color || grupo.color }]}
              onPress={() => router.push(`/checklist/${grupo.id}/${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconoBadge, { backgroundColor: item.color || grupo.color }]}>
                <Ionicons name={(item.icono || 'home-outline') as any} size={26} color="#fff" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardNombre}>{item.nombre}</Text>
                <Text style={styles.cardSub}>
                  {(item.secciones || []).length} secciones · {completadas}/{total} tareas
                </Text>
                <View style={styles.barraFondoSmall}>
                  <View style={[styles.barraRellenoSmall, {
                    width: `${pct}%` as any,
                    backgroundColor: item.color || grupo.color
                  }]} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="construct-outline" size={60} color="#bdbdbd" />
            <Text style={styles.emptyText}>Sin ambientes en tu grupo</Text>
            <Text style={styles.emptySub}>El admin aún no ha agregado ambientes</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#555', fontSize: 16 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#212121', marginTop: 12 },
  errorSub: { fontSize: 14, color: '#9e9e9e', textAlign: 'center', marginTop: 6 },
  btnSalir: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#1a237e', borderRadius: 12 },
  btnSalirTexto: { color: '#fff', fontWeight: '700' },
  header: { backgroundColor: '#1a237e', paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#c5cae9', fontSize: 13, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 },
  grupoBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start', marginTop: 10 },
  grupoDot: { width: 8, height: 8, borderRadius: 4 },
  grupoTexto: { fontSize: 12, fontWeight: '700' },
  resumenContainer: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: -10, borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  resumenTexto: { fontSize: 13, color: '#546e7a', marginBottom: 6 },
  resumenPct: { fontSize: 12, color: '#1a237e', fontWeight: '600', marginTop: 4, textAlign: 'right' },
  barraFondo: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' },
  barraRelleno: { height: 8, backgroundColor: '#1a237e', borderRadius: 4 },
  lista: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderLeftWidth: 5, flexDirection: 'row', alignItems: 'center', padding: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4 },
  iconoBadge: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  cardNombre: { fontSize: 16, fontWeight: '700', color: '#212121' },
  cardSub: { fontSize: 12, color: '#78909c', marginTop: 2, marginBottom: 6 },
  barraFondoSmall: { height: 5, backgroundColor: '#eeeeee', borderRadius: 3, overflow: 'hidden' },
  barraRellenoSmall: { height: 5, borderRadius: 3 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, color: '#9e9e9e', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#bdbdbd', marginTop: 4 },
});
