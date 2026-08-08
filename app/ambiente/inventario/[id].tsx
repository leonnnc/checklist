import React, { useState } from 'react';
import {
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  Alert, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../src/context/AppContext';
import { ItemInventario } from '../../../src/types';

type ModalMode = 'seccion' | 'item' | 'editItem' | null;

const UNIDADES = ['piezas', 'pieza', 'kg', 'g', 'litros', 'ml', 'rollos', 'pares', 'juego', 'juegos', 'cajas', 'bolsas'];

export default function InventarioAmbienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data,
    addSeccionInventario, deleteSeccionInventario,
    addItemInventario, updateItemInventario, deleteItemInventario,
  } = useApp();

  const ambiente = data.ambientes.find((a) => a.id === id);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [seccionActivaId, setSeccionActivaId] = useState('');
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [unidad, setUnidad] = useState('piezas');
  const [minimo, setMinimo] = useState('');
  const [notas, setNotas] = useState('');
  const [editItemId, setEditItemId] = useState('');

  if (!ambiente) {
    return <View style={styles.centered}><Text>Ambiente no encontrado</Text></View>;
  }

  const secciones = ambiente.seccionesInventario.map((s) => ({
    id: s.id,
    title: s.nombre,
    data: s.items,
  }));

  const totalItems = ambiente.seccionesInventario.flatMap((s) => s.items).length;

  function resetForm() {
    setNombre(''); setCantidad('1'); setUnidad('piezas'); setMinimo(''); setNotas(''); setEditItemId('');
  }

  function handleAddSeccion() {
    if (!nombre.trim()) return;
    addSeccionInventario(ambiente!.id, nombre.trim());
    resetForm(); setModalMode(null);
  }

  function abrirModalItem(seccionId: string) {
    setSeccionActivaId(seccionId); resetForm(); setModalMode('item');
  }

  function handleAddItem() {
    if (!nombre.trim()) return;
    addItemInventario(ambiente!.id, seccionActivaId, {
      nombre: nombre.trim(),
      cantidad: parseFloat(cantidad) || 0,
      unidad,
      minimo: minimo ? parseFloat(minimo) : undefined,
      notas: notas.trim() || undefined,
    });
    resetForm(); setModalMode(null);
  }

  function abrirEditar(seccionId: string, item: ItemInventario) {
    setSeccionActivaId(seccionId);
    setEditItemId(item.id);
    setNombre(item.nombre);
    setCantidad(String(item.cantidad));
    setUnidad(item.unidad);
    setMinimo(item.minimo != null ? String(item.minimo) : '');
    setNotas(item.notas ?? '');
    setModalMode('editItem');
  }

  function handleEditItem() {
    if (!nombre.trim()) return;
    updateItemInventario(ambiente!.id, seccionActivaId, editItemId, {
      nombre: nombre.trim(),
      cantidad: parseFloat(cantidad) || 0,
      unidad,
      minimo: minimo ? parseFloat(minimo) : undefined,
      notas: notas.trim() || undefined,
    });
    resetForm(); setModalMode(null);
  }

  function handleDeleteItem(seccionId: string, itemId: string, itemNombre: string) {
    Alert.alert('Eliminar', `¿Eliminar "${itemNombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteItemInventario(ambiente!.id, seccionId, itemId) },
    ]);
  }

  function handleDeleteSeccion(seccionId: string, seccionNombre: string) {
    Alert.alert('Eliminar sección', `¿Eliminar "${seccionNombre}" y todos sus artículos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteSeccionInventario(ambiente!.id, seccionId) },
    ]);
  }

  const colorAmbiente = ambiente.color;

  return (
    <>
      <Stack.Screen options={{ title: `Inventario – ${ambiente.nombre}` }} />
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: colorAmbiente }]}>
          <Ionicons name={ambiente.icono as any} size={28} color="#fff" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerTitulo}>{ambiente.nombre}</Text>
            <Text style={styles.headerSub}>{totalItems} artículos registrados</Text>
          </View>
        </View>

        <SectionList
          sections={secciones}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.seccionHeader}>
              <Text style={styles.seccionNombre}>{section.title}</Text>
              <TouchableOpacity onPress={() => abrirModalItem(section.id)} style={styles.seccionBtn}>
                <Ionicons name="add-circle-outline" size={20} color={colorAmbiente} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSeccion(section.id, section.title)} style={styles.seccionBtn}>
                <Ionicons name="trash-outline" size={18} color="#e57373" />
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item, section }) => {
            const bajo = item.minimo != null && item.cantidad < item.minimo;
            return (
              <TouchableOpacity
                style={styles.itemRow}
                onPress={() => abrirEditar(section.id, item)}
                onLongPress={() => handleDeleteItem(section.id, item.id, item.nombre)}
                activeOpacity={0.8}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemNombre}>{item.nombre}</Text>
                  {item.notas ? <Text style={styles.itemNotas}>{item.notas}</Text> : null}
                  {item.minimo != null && (
                    <Text style={[styles.itemMinimo, bajo && styles.itemMinimoAlert]}>
                      {bajo ? '⚠️ ' : ''}Mínimo: {item.minimo} {item.unidad}
                    </Text>
                  )}
                </View>
                <View style={[styles.cantidadBadge, bajo && styles.cantidadBadgeLow]}>
                  <Text style={[styles.cantidadTexto, bajo && styles.cantidadTextoBajo]}>
                    {item.cantidad}
                  </Text>
                  <Text style={[styles.unidadTexto, bajo && styles.cantidadTextoBajo]}>{item.unidad}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          renderSectionFooter={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="list-outline" size={50} color="#bdbdbd" />
              <Text style={styles.emptyText}>Sin inventario aún</Text>
              <Text style={styles.emptySub}>Toca + para agregar una sección</Text>
            </View>
          }
        />

        <TouchableOpacity style={[styles.fab, { backgroundColor: colorAmbiente }]} onPress={() => { resetForm(); setModalMode('seccion'); }}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Modal nueva sección */}
        <Modal visible={modalMode === 'seccion'} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitulo}>Nueva Sección</Text>
              <TextInput style={styles.input} placeholder="Ej: Electrodomésticos, Ropa..." value={nombre} onChangeText={setNombre} autoFocus maxLength={40} />
              <View style={styles.modalBotones}>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalMode(null)}>
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnGuardar, { backgroundColor: colorAmbiente }]} onPress={handleAddSeccion}>
                  <Text style={styles.btnGuardarTexto}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal agregar / editar artículo */}
        <Modal visible={modalMode === 'item' || modalMode === 'editItem'} animationType="slide" transparent>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitulo}>{modalMode === 'editItem' ? 'Editar Artículo' : 'Nuevo Artículo'}</Text>
                <TextInput style={styles.input} placeholder="Nombre del artículo" value={nombre} onChangeText={setNombre} maxLength={60} />
                <View style={styles.row}>
                  <View style={[styles.inputWrap, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Cantidad</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={cantidad} onChangeText={setCantidad} />
                  </View>
                  <View style={[styles.inputWrap, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Mínimo (opcional)</Text>
                    <TextInput style={styles.input} keyboardType="numeric" placeholder="—" value={minimo} onChangeText={setMinimo} />
                  </View>
                </View>
                <Text style={styles.inputLabel}>Unidad</Text>
                <View style={styles.unidadesWrap}>
                  {UNIDADES.map((u) => (
                    <TouchableOpacity
                      key={u}
                      style={[styles.unidadChip, unidad === u && { backgroundColor: colorAmbiente }]}
                      onPress={() => setUnidad(u)}
                    >
                      <Text style={[styles.unidadChipTexto, unidad === u && { color: '#fff' }]}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="Notas (opcional)" value={notas} onChangeText={setNotas} maxLength={100} />
                <View style={styles.modalBotones}>
                  <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalMode(null)}>
                    <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnGuardar, { backgroundColor: colorAmbiente }]} onPress={modalMode === 'editItem' ? handleEditItem : handleAddItem}>
                    <Text style={styles.btnGuardarTexto}>{modalMode === 'editItem' ? 'Guardar' : 'Agregar'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  headerTitulo: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  lista: { padding: 16, paddingBottom: 100 },
  seccionHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginTop: 8, marginBottom: 4 },
  seccionNombre: { flex: 1, fontSize: 15, fontWeight: '700', color: '#37474f' },
  seccionBtn: { marginLeft: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 6, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3 },
  itemInfo: { flex: 1 },
  itemNombre: { fontSize: 15, color: '#212121', fontWeight: '500' },
  itemNotas: { fontSize: 12, color: '#90a4ae', marginTop: 2 },
  itemMinimo: { fontSize: 11, color: '#78909c', marginTop: 2 },
  itemMinimoAlert: { color: '#e65100' },
  cantidadBadge: { backgroundColor: '#e8eaf6', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', minWidth: 60 },
  cantidadBadgeLow: { backgroundColor: '#fbe9e7' },
  cantidadTexto: { fontSize: 20, fontWeight: '700', color: '#1a237e' },
  cantidadTextoBajo: { color: '#c62828' },
  unidadTexto: { fontSize: 10, color: '#7986cb', marginTop: 1 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#9e9e9e', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#bdbdbd', marginTop: 4 },
  fab: { position: 'absolute', bottom: 28, right: 24, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitulo: { fontSize: 20, fontWeight: '700', color: '#1a237e', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: '#fafafa', marginBottom: 4 },
  row: { flexDirection: 'row', marginTop: 4 },
  inputWrap: {},
  inputLabel: { fontSize: 12, color: '#546e7a', fontWeight: '600', marginBottom: 4, marginTop: 8 },
  unidadesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  unidadChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, backgroundColor: '#eeeeee' },
  unidadChipTexto: { fontSize: 13, color: '#546e7a' },
  modalBotones: { flexDirection: 'row', marginTop: 20, gap: 12 },
  btnCancelar: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  btnCancelarTexto: { color: '#546e7a', fontWeight: '600' },
  btnGuardar: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  btnGuardarTexto: { color: '#fff', fontWeight: '700' },
});
