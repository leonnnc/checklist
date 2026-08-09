import React, { useEffect, useState } from 'react';
import {
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthCtx } from '../../../src/context/AuthContext';
import { getGrupo, marcarTarea, suscribirProgresoUsuario } from '../../../src/firebase/firestore';
import type { Grupo, ProgresoTarea, Seccion, Tarea } from '../../../src/types/firebase';

export default function ChecklistScreen() {
  const { grupoId, ambienteId } = useLocalSearchParams<{ grupoId: string; ambienteId: string }>();
  const { user, profile } = useAuthCtx();
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [progresos, setProgresos] = useState<ProgresoTarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!grupoId) return;
    getGrupo(grupoId).then(g => { setGrupo(g); setLoading(false); });
    const unsub = suscribirProgresoUsuario(user!.uid, grupoId, setProgresos);
    return unsub;
  }, [grupoId]);

  const ambiente = grupo?.ambientes?.find(a => a.id === ambienteId);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  if (!ambiente) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Ambiente no encontrado</Text>
      </View>
    );
  }

  // Calcular progreso de este ambiente
  const todasTareas = (ambiente.secciones || []).flatMap(s => s.tareas || []);
  const completadasAmb = progresos.filter(p => p.ambienteId === ambienteId && p.completado).length;
  const pct = todasTareas.length > 0 ? Math.round((completadasAmb / todasTareas.length) * 100) : 0;

  function isTareaCompletada(tareaId: string) {
    return progresos.some(p => p.tareaId === tareaId && p.ambienteId === ambienteId && p.completado);
  }

  function getCompletadaEn(tareaId: string) {
    return progresos.find(p => p.tareaId === tareaId && p.ambienteId === ambienteId)?.completadoEn;
  }

  async function toggleTarea(seccion: Seccion, tarea: Tarea) {
    if (!user || !profile) return;
    const hecho = isTareaCompletada(tarea.id);
    setSaving(tarea.id);
    try {
      await marcarTarea(
        user.uid,
        profile.nombre,
        grupoId,
        ambienteId,
        seccion.id,
        tarea.id,
        !hecho
      );
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el cambio.');
    } finally {
      setSaving(null);
    }
  }

  const color = ambiente.color || grupo!.color;

  const sections = (ambiente.secciones || []).map(s => ({
    ...s,
    data: s.tareas || [],
  }));

  return (
    <>
      <Stack.Screen options={{ title: ambiente.nombre }} />
      <View style={styles.container}>
        {/* Header con progreso */}
        <View style={[styles.header, { backgroundColor: color }]}>
          <View style={styles.headerRow}>
            <Ionicons name={(ambiente.icono || 'home-outline') as any} size={32} color="#fff" />
            <View style={styles.headerTextos}>
              <Text style={styles.headerNombre}>{ambiente.nombre}</Text>
              <Text style={styles.headerSub}>{completadasAmb}/{todasTareas.length} tareas completadas</Text>
            </View>
          </View>
          <View style={styles.barraFondo}>
            <View style={[styles.barraRelleno, { width: `${pct}%` as any }]} />
          </View>
          <Text style={styles.headerPct}>{pct}%</Text>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.lista}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.seccionHeader}>
              <Text style={styles.seccionNombre}>{section.nombre}</Text>
              <Text style={styles.seccionConteo}>
                {progresos.filter(p => p.seccionId === section.id && p.completado).length}/{(section.tareas || []).length}
              </Text>
            </View>
          )}
          renderItem={({ item: tarea, section }) => {
            const hecho = isTareaCompletada(tarea.id);
            const completadaEn = getCompletadaEn(tarea.id);
            const isSaving = saving === tarea.id;
            return (
              <TouchableOpacity
                style={[styles.tareaRow, hecho && styles.tareaRowHecha]}
                onPress={() => toggleTarea(section as any, tarea)}
                activeOpacity={0.7}
                disabled={isSaving}
              >
                <View style={[styles.checkbox, hecho && { backgroundColor: color, borderColor: color }]}>
                  {isSaving
                    ? <ActivityIndicator size="small" color={hecho ? '#fff' : color} />
                    : hecho && <Ionicons name="checkmark" size={14} color="#fff" />
                  }
                </View>
                <View style={styles.tareaInfo}>
                  <Text style={[styles.tareaNombre, hecho && styles.tareaHecha]}>{tarea.nombre}</Text>
                  {hecho && completadaEn && (
                    <Text style={styles.tareaFecha}>
                      ✓ {new Date(completadaEn).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          renderSectionFooter={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="checkmark-done-outline" size={50} color="#bdbdbd" />
              <Text style={styles.emptyText}>Sin tareas en este ambiente</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#9e9e9e' },
  header: { padding: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerTextos: { flex: 1, marginLeft: 12 },
  headerNombre: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  barraFondo: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  barraRelleno: { height: 8, backgroundColor: '#fff', borderRadius: 4 },
  headerPct: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'right', marginTop: 4 },
  lista: { padding: 16, paddingBottom: 40 },
  seccionHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginTop: 8, marginBottom: 4 },
  seccionNombre: { flex: 1, fontSize: 15, fontWeight: '700', color: '#37474f' },
  seccionConteo: { fontSize: 12, color: '#78909c', fontWeight: '600' },
  tareaRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 6, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3 },
  tareaRowHecha: { backgroundColor: '#f9fffe' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#bdbdbd', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 1 },
  tareaInfo: { flex: 1 },
  tareaNombre: { fontSize: 15, color: '#212121' },
  tareaHecha: { textDecorationLine: 'line-through', color: '#9e9e9e' },
  tareaFecha: { fontSize: 11, color: '#bdbdbd', marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#9e9e9e', marginTop: 12 },
});
