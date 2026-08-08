import React, { useState } from 'react';
import {
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  Alert, Modal, TextInput, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { TareaLimpieza } from '../../src/types';

export default function AmbienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, toggleTarea, addTarea, deleteTarea, resetTareas, addSeccionLimpieza, deleteSeccionLimpieza } = useApp();

  const ambiente = data.ambientes.find((a) => a.id === id);

  const [modalSeccion, setModalSeccion] = useState(false);
  const [modalTarea, setModalTarea] = useState(false);
  const [seccionActivaId, setSeccionActivaId] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');

  if (!ambiente) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Ambiente no encontrado</Text>
      </View>
    );
  }

  const totalTareas = ambiente.seccionesLimpieza.flatMap((s) => s.tareas).length;
  const completadas = ambiente.seccionesLimpieza.flatMap((s) => s.tareas).filter((t) => t.estado === 'completado').length;
  const pct = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;

  const secciones = ambiente.seccionesLimpieza.map((s) => ({
    id: s.id,
    title: s.nombre,
    data: s.tareas,
  }));

  function handleToggle(seccionId: string, tarea: TareaLimpieza) {
    toggleTarea(ambiente!.id, seccionId, tarea.id);
  }

  function handleDeleteTarea(seccionId: string, tareaId: string) {
    Alert.alert('Eliminar tarea', '¿Eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteTarea(ambiente!.id, seccionId, tareaId) },
    ]);
  }

  function handleDeleteSeccion(seccionId: string, nombre: string) {
    Alert.alert('Eliminar sección', `¿Eliminar "${nombre}" y todas sus tareas?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteSeccionLimpieza(ambiente!.id, seccionId) },
    ]);
  }

  function handleReset() {
    Alert.alert('Reiniciar checklist', '¿Marcar todas las tareas como pendientes?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reiniciar', style: 'destructive', onPress: () => resetTareas(ambiente!.id) },
    ]);
  }

  function handleAddSeccion() {
    if (!nuevoNombre.trim()) return;
    addSeccionLimpieza(ambiente!.id, nuevoNombre.trim());
    setNuevoNombre('');
    setModalSeccion(false);
  }

  function handleAddTarea() {
    if (!nuevoNombre.trim() || !seccionActivaId) return;
    addTarea(ambiente!.id, seccionActivaId, nuevoNombre.trim());
    setNuevoNombre('');
    setModalTarea(false);
  }

  function abrirModalTarea(seccionId: string) {
    setSeccionActivaId(seccionId);
    setModalTarea(true);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: ambiente.nombre,
          headerRight: () => (
            <TouchableOpacity onPress={handleReset} style={{ marginRight: 16 }}>
              <Ionicons name="refresh-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {/* Encabezado con progreso */}
        <View style={[styles.header, { backgroundColor: ambiente.color }]}>
          <View style={styles.headerRow}>
            <Ionicons name={ambiente.icono as any} size={32} color="#fff" />
            <View style={styles.headerTextos}>
              <Text style={styles.headerNombre}>{ambiente.nombre}</Text>
              <Text style={styles.headerSub}>{completadas}/{totalTareas} tareas completadas</Text>
            </View>
            <TouchableOpacity
              style={styles.btnInventario}
              onPress={() => router.push(`/ambiente/inventario/${ambiente!.id}`)}
            >
              <Ionicons name="list-outline" size={18} color="#fff" />
              <Text style={styles.btnInventarioTexto}>Inventario</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.barraFondo}>
            <View style={[styles.barraRelleno, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.headerPct}>{pct}%</Text>
        </View>

        {/* Lista de secciones y tareas */}
        <SectionList
          sections={secciones}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.seccionHeader}>
              <Text style={styles.seccionNombre}>{section.title}</Text>
              <View style={styles.seccionAcciones}>
                <TouchableOpacity
                  style={styles.btnSeccionAdd}
                  onPress={() => abrirModalTarea(section.id)}
                >
                  <Ionicons name="add-circle-outline" size={20} color={ambiente.color} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteSeccion(section.id, section.title)}>
                  <Ionicons name="trash-outline" size={18} color="#e57373" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderItem={({ item, section }) => {
            const hecho = item.estado === 'completado';
            return (
              <TouchableOpacity
                style={styles.tareaRow}
                onPress={() => handleToggle(section.id, item)}
                onLongPress={() => handleDeleteTarea(section.id, item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, hecho && { backgroundColor: ambiente.color, borderColor: ambiente.color }]}>
                  {hecho && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <View style={styles.tareaInfo}>
                  <Text style={[styles.tareaNombre, hecho && styles.tareaHecha]}>{item.nombre}</Text>
                  {hecho && item.completadoEn && (
                    <Text style={styles.tareaFecha}>
                      ✓ {new Date(item.completadoEn).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          renderSectionFooter={() => <View style={styles.seccionFooter} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="checkmark-done-outline" size={50} color="#bdbdbd" />
              <Text style={styles.emptyText}>Sin secciones aún</Text>
              <Text style={styles.emptySub}>Toca + para agregar una sección</Text>
            </View>
          }
        />

        {/* FAB agregar sección */}
        <TouchableOpacity style={[styles.fab, { backgroundColor: ambiente.color }]} onPress={() => setModalSeccion(true)}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Modal nueva sección */}
        <Modal visible={modalSeccion} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitulo}>Nueva Sección de Limpieza</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Ventanas, Closet, Baño..."
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
                autoFocus
                maxLength={40}
              />
              <View style={styles.modalBotones}>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => { setModalSeccion(false); setNuevoNombre(''); }}>
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnGuardar, { backgroundColor: ambiente.color }]} onPress={handleAddSeccion}>
                  <Text style={styles.btnGuardarTexto}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal nueva tarea */}
        <Modal visible={modalTarea} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitulo}>Nueva Tarea</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Limpiar polvo, Barrer..."
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
                autoFocus
                maxLength={60}
              />
              <View style={styles.modalBotones}>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => { setModalTarea(false); setNuevoNombre(''); }}>
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnGuardar, { backgroundColor: ambiente.color }]} onPress={handleAddTarea}>
                  <Text style={styles.btnGuardarTexto}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  btnInventario: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  btnInventarioTexto: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: '600' },
  barraFondo: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  barraRelleno: { height: 8, backgroundColor: '#fff', borderRadius: 4 },
  headerPct: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'right', marginTop: 4 },
  lista: { padding: 16, paddingBottom: 100 },
  seccionHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginTop: 8, marginBottom: 4 },
  seccionNombre: { flex: 1, fontSize: 15, fontWeight: '700', color: '#37474f' },
  seccionAcciones: { flexDirection: 'row', gap: 12 },
  btnSeccionAdd: {},
  tareaRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 6, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#bdbdbd', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 1 },
  tareaInfo: { flex: 1 },
  tareaNombre: { fontSize: 15, color: '#212121' },
  tareaHecha: { textDecorationLine: 'line-through', color: '#9e9e9e' },
  tareaFecha: { fontSize: 11, color: '#bdbdbd', marginTop: 2 },
  seccionFooter: { height: 8 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#9e9e9e', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#bdbdbd', marginTop: 4 },
  fab: { position: 'absolute', bottom: 28, right: 24, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitulo: { fontSize: 20, fontWeight: '700', color: '#1a237e', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: '#fafafa', marginBottom: 4 },
  modalBotones: { flexDirection: 'row', marginTop: 20, gap: 12 },
  btnCancelar: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  btnCancelarTexto: { color: '#546e7a', fontWeight: '600' },
  btnGuardar: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnGuardarTexto: { color: '#fff', fontWeight: '700' },
});
