import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, Modal, TextInput, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { Ambiente } from '../../src/types';

const ICONOS = [
  'home-outline','bed-outline','restaurant-outline','tv-outline','water-outline',
  'shirt-outline','pizza-outline','archive-outline','leaf-outline','car-outline',
  'briefcase-outline','book-outline','bicycle-outline','desktop-outline','cafe-outline',
];

const COLORES = [
  '#3f51b5','#e65100','#7b1fa2','#00897b','#f57f17',
  '#546e7a','#c62828','#2e7d32','#0277bd','#ad1457',
];

export default function HomeScreen() {
  const router = useRouter();
  const { data, loading, addAmbiente, deleteAmbiente } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoIcono, setNuevoIcono] = useState(ICONOS[0]);
  const [nuevoColor, setNuevoColor] = useState(COLORES[0]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text style={styles.loadingText}>Cargando Depa 804...</Text>
      </View>
    );
  }

  function progreso(amb: Ambiente) {
    const todas = amb.seccionesLimpieza.flatMap((s) => s.tareas);
    const completadas = todas.filter((t) => t.estado === 'completado');
    return { total: todas.length, completadas: completadas.length };
  }

  function handleDelete(amb: Ambiente) {
    Alert.alert(
      'Eliminar ambiente',
      `¿Eliminar "${amb.nombre}" y todo su contenido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteAmbiente(amb.id) },
      ]
    );
  }

  function handleAdd() {
    if (!nuevoNombre.trim()) {
      Alert.alert('Nombre requerido', 'Escribe un nombre para el ambiente.');
      return;
    }
    addAmbiente(nuevoNombre.trim(), nuevoIcono, nuevoColor);
    setNuevoNombre('');
    setNuevoIcono(ICONOS[0]);
    setNuevoColor(COLORES[0]);
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏠 Departamento 804</Text>
        <Text style={styles.headerSub}>Checklist de Limpieza e Inventario</Text>
      </View>

      {/* Resumen global */}
      <View style={styles.resumenContainer}>
        {(() => {
          const totalAmb = data.ambientes.length;
          const totalTareas = data.ambientes.flatMap((a) => a.seccionesLimpieza.flatMap((s) => s.tareas)).length;
          const completadas = data.ambientes.flatMap((a) => a.seccionesLimpieza.flatMap((s) => s.tareas)).filter((t) => t.estado === 'completado').length;
          const pct = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;
          return (
            <>
              <Text style={styles.resumenTexto}>{totalAmb} ambientes · {completadas}/{totalTareas} tareas</Text>
              <View style={styles.barraFondo}>
                <View style={[styles.barraRelleno, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.resumenPct}>{pct}% completado</Text>
            </>
          );
        })()}
      </View>

      {/* Lista de ambientes */}
      <FlatList
        data={data.ambientes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const { total, completadas } = progreso(item);
          const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;
          return (
            <View style={[styles.card, { borderLeftColor: item.color }]}>
              <TouchableOpacity
                style={styles.cardBody}
                onPress={() => router.push(`/ambiente/${item.id}`)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconoBadge, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icono as any} size={26} color="#fff" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardNombre}>{item.nombre}</Text>
                  <Text style={styles.cardSub}>{item.seccionesLimpieza.length} secciones · {completadas}/{total} tareas</Text>
                  <View style={styles.barraFondoSmall}>
                    <View style={[styles.barraRellenoSmall, { width: `${pct}%`, backgroundColor: item.color }]} />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
              </TouchableOpacity>

              <View style={styles.cardAcciones}>
                <TouchableOpacity
                  style={styles.btnAccion}
                  onPress={() => router.push(`/ambiente/inventario/${item.id}`)}
                >
                  <Ionicons name="list-outline" size={16} color="#546e7a" />
                  <Text style={styles.btnAccionTexto}>Inventario</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAccionDanger} onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-outline" size={16} color="#c62828" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="home-outline" size={60} color="#bdbdbd" />
            <Text style={styles.emptyText}>No hay ambientes aún</Text>
            <Text style={styles.emptySub}>Toca + para agregar uno</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal: nuevo ambiente */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Nuevo Ambiente</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del ambiente (ej: Terraza)"
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
              maxLength={30}
            />

            <Text style={styles.modalLabel}>Ícono</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorRow}>
              {ICONOS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  style={[styles.iconoOpc, nuevoIcono === ic && styles.iconoOpcSelected]}
                  onPress={() => setNuevoIcono(ic)}
                >
                  <Ionicons name={ic as any} size={24} color={nuevoIcono === ic ? '#fff' : '#555'} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalLabel}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorRow}>
              {COLORES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorOpc, { backgroundColor: c }, nuevoColor === c && styles.colorOpcSelected]}
                  onPress={() => setNuevoColor(c)}
                />
              ))}
            </ScrollView>

            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={handleAdd}>
                <Text style={styles.btnGuardarTexto}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#555', fontSize: 16 },
  header: { backgroundColor: '#1a237e', paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#c5cae9', fontSize: 13, marginTop: 2 },
  resumenContainer: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: -10, borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  resumenTexto: { fontSize: 13, color: '#546e7a', marginBottom: 6 },
  resumenPct: { fontSize: 12, color: '#1a237e', fontWeight: '600', marginTop: 4, textAlign: 'right' },
  barraFondo: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' },
  barraRelleno: { height: 8, backgroundColor: '#1a237e', borderRadius: 4 },
  lista: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderLeftWidth: 5, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4 },
  cardBody: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  iconoBadge: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  cardNombre: { fontSize: 16, fontWeight: '700', color: '#212121' },
  cardSub: { fontSize: 12, color: '#78909c', marginTop: 2, marginBottom: 6 },
  barraFondoSmall: { height: 5, backgroundColor: '#eeeeee', borderRadius: 3, overflow: 'hidden' },
  barraRellenoSmall: { height: 5, borderRadius: 3 },
  cardAcciones: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center' },
  btnAccion: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  btnAccionTexto: { fontSize: 13, color: '#546e7a', marginLeft: 4 },
  btnAccionDanger: { marginLeft: 'auto' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, color: '#9e9e9e', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#bdbdbd', marginTop: 4 },
  fab: { position: 'absolute', bottom: 28, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#1a237e', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#1a237e', shadowOpacity: 0.4, shadowRadius: 8 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitulo: { fontSize: 20, fontWeight: '700', color: '#1a237e', marginBottom: 16 },
  modalLabel: { fontSize: 13, color: '#546e7a', fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: '#fafafa' },
  selectorRow: { flexGrow: 0 },
  iconoOpc: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  iconoOpcSelected: { backgroundColor: '#1a237e' },
  colorOpc: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  colorOpcSelected: { borderWidth: 3, borderColor: '#212121' },
  modalBotones: { flexDirection: 'row', marginTop: 24, gap: 12 },
  btnCancelar: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  btnCancelarTexto: { color: '#546e7a', fontWeight: '600' },
  btnGuardar: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#1a237e', alignItems: 'center' },
  btnGuardarTexto: { color: '#fff', fontWeight: '700' },
});
