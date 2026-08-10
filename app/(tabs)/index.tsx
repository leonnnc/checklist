import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../src/firebase/config';
import { useAuthCtx } from '../../src/context/AuthContext';
import { getGrupo, suscribirProgresoUsuario, resetProgresoUsuario } from '../../src/firebase/firestore';
import type { Grupo, ProgresoTarea, Ambiente } from '../../src/types/firebase';

// ─── VISTA ADMIN ─────────────────────────────────────────────────────────────
function AdminView() {
  const { signOut } = useAuthCtx();
  const [grupos, setGrupos]     = useState<Grupo[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [progresos, setProgresos] = useState<ProgresoTarea[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, 'grupos'), s => {
      setGrupos(s.docs.map(d => ({ id: d.id, ...d.data() } as Grupo)));
      setLoading(false);
    });
    const u2 = onSnapshot(collection(db, 'usuarios'), s =>
      setUsuarios(s.docs.map(d => ({ id: d.id, ...d.data() })).filter((u: any) => u.rol !== 'admin'))
    );
    const u3 = onSnapshot(collection(db, 'progreso'), s =>
      setProgresos(s.docs.map(d => d.data() as ProgresoTarea))
    );
    return () => { u1(); u2(); u3(); };
  }, []);

  const totalTareas    = progresos.length;
  const totalComplet   = progresos.filter(p => p.completado).length;
  const pctGlobal      = totalTareas > 0 ? Math.round((totalComplet / totalTareas) * 100) : 0;

  if (loading) return (
    <View style={s.centered}>
      <ActivityIndicator size="large" color="#1a237e" />
    </View>
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.headerTitle}>🏠 Depa 804</Text>
            <Text style={s.headerSub}>Vista de Administrador</Text>
          </View>
          <TouchableOpacity onPress={signOut} style={s.headerBtn}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Progreso global */}
        <View style={s.barraFondo}>
          <View style={[s.barraRelleno, { width: `${pctGlobal}%` as any }]} />
        </View>
        <Text style={s.pctTexto}>{pctGlobal}% global · {totalComplet}/{totalTareas} tareas</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {grupos.map(grupo => {
          const usuariosGrupo = usuarios.filter((u: any) => u.grupoId === grupo.id);
          const progGrupo     = progresos.filter(p => p.grupoId === grupo.id);
          const compGrupo     = progGrupo.filter(p => p.completado).length;
          const pctGrupo      = progGrupo.length > 0 ? Math.round((compGrupo / progGrupo.length) * 100) : 0;

          return (
            <View key={grupo.id} style={s.grupoCard}>
              {/* Header grupo */}
              <View style={[s.grupoHeader, { borderLeftColor: grupo.color }]}>
                <View style={{ flex: 1 }}>
                  <Text style={s.grupoNombre}>{grupo.nombre}</Text>
                  <Text style={s.grupoSub}>{usuariosGrupo.length} usuario(s) · {pctGrupo}%</Text>
                </View>
                <Text style={[s.grupoPct, { color: grupo.color }]}>{pctGrupo}%</Text>
              </View>

              {/* Barra grupo */}
              <View style={s.barraFondoSm}>
                <View style={[s.barraRellenoSm, { width: `${pctGrupo}%` as any, backgroundColor: grupo.color }]} />
              </View>

              {/* Usuarios del grupo */}
              {usuariosGrupo.length === 0 ? (
                <Text style={s.sinUsuarios}>Sin usuarios asignados</Text>
              ) : (
                usuariosGrupo.map((u: any) => {
                  const progU    = progresos.filter(p => p.usuarioId === u.id && p.grupoId === grupo.id);
                  const compU    = progU.filter(p => p.completado).length;
                  const totalU   = progU.length;
                  const pctU     = totalU > 0 ? Math.round((compU / totalU) * 100) : 0;
                  const ultimaAct = progU
                    .filter(p => p.completado && p.completadoEn)
                    .sort((a, b) => new Date(b.completadoEn!).getTime() - new Date(a.completadoEn!).getTime())[0];

                  return (
                    <View key={u.id} style={s.usuarioRow}>
                      <View style={[s.avatar, { backgroundColor: grupo.color + '22' }]}>
                        <Text style={[s.avatarLetra, { color: grupo.color }]}>
                          {u.nombre.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.usuarioNombre}>{u.nombre}</Text>
                        {ultimaAct && (
                          <Text style={s.ultimaAct}>
                            Última actividad: {new Date(ultimaAct.completadoEn!).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                          </Text>
                        )}
                        <View style={s.barraFondoXs}>
                          <View style={[s.barraRellenoXs, { width: `${pctU}%` as any, backgroundColor: grupo.color }]} />
                        </View>
                      </View>
                      <Text style={[s.usuarioPct, { color: grupo.color }]}>{pctU}%</Text>
                    </View>
                  );
                })
              )}
            </View>
          );
        })}

        {grupos.length === 0 && (
          <View style={s.empty}>
            <Ionicons name="layers-outline" size={50} color="#bdbdbd" />
            <Text style={s.emptyTexto}>No hay grupos creados aún</Text>
            <Text style={s.emptySub}>Crea grupos desde el panel web</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── VISTA USUARIO ────────────────────────────────────────────────────────────
function UsuarioView() {
  const router = useRouter();
  const { user, profile, signOut } = useAuthCtx();
  const [grupo, setGrupo]       = useState<Grupo | null>(null);
  const [progresos, setProgresos] = useState<ProgresoTarea[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!profile?.grupoId) { setLoading(false); return; }
    getGrupo(profile.grupoId).then(g => { setGrupo(g); setLoading(false); });
    const unsub = suscribirProgresoUsuario(user!.uid, profile.grupoId, setProgresos);
    return unsub;
  }, [profile?.grupoId]);

  function getProgreso(ambienteId: string) {
    if (!grupo) return { total: 0, completadas: 0, pct: 0 };
    const amb = grupo.ambientes?.find(a => a.id === ambienteId);
    if (!amb) return { total: 0, completadas: 0, pct: 0 };
    const total      = (amb.secciones || []).flatMap(s => s.tareas || []).length;
    const completadas = progresos.filter(p => p.ambienteId === ambienteId && p.completado).length;
    return { total, completadas, pct: total > 0 ? Math.round((completadas / total) * 100) : 0 };
  }

  function getProgresoGlobal() {
    if (!grupo) return { total: 0, completadas: 0, pct: 0 };
    const total      = (grupo.ambientes || []).flatMap(a => (a.secciones || []).flatMap(s => s.tareas || [])).length;
    const completadas = progresos.filter(p => p.completado).length;
    return { total, completadas, pct: total > 0 ? Math.round((completadas / total) * 100) : 0 };
  }

  async function handleReset() {
    Alert.alert('Reiniciar checklist', '¿Marcar todas las tareas como pendientes?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reiniciar', style: 'destructive', onPress: async () => {
        await resetProgresoUsuario(user!.uid, profile!.grupoId);
      }},
    ]);
  }

  if (loading) return (
    <View style={s.centered}>
      <ActivityIndicator size="large" color="#1a237e" />
      <Text style={s.loadingTexto}>Cargando...</Text>
    </View>
  );

  if (!grupo) return (
    <View style={s.centered}>
      <Ionicons name="alert-circle-outline" size={48} color="#e57373" />
      <Text style={s.errorTitulo}>Sin grupo asignado</Text>
      <Text style={s.errorSub}>Contacta al administrador</Text>
      <TouchableOpacity style={s.btnSalir} onPress={signOut}>
        <Text style={s.btnSalirTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );

  const global    = getProgresoGlobal();
  const ambientes = grupo.ambientes || [];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.headerTitle}>🏠 Depa 804</Text>
            <Text style={s.headerSub}>Hola, {profile?.nombre?.split(' ')[0]}</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity onPress={handleReset} style={s.headerBtn}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} style={s.headerBtn}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[s.grupoBadge, { backgroundColor: grupo.color + '33' }]}>
          <View style={[s.grupoDot, { backgroundColor: grupo.color }]} />
          <Text style={[s.grupoTexto, { color: grupo.color }]}>{grupo.nombre}</Text>
        </View>
      </View>

      <View style={s.resumen}>
        <Text style={s.resumenTexto}>{ambientes.length} ambientes · {global.completadas}/{global.total} tareas</Text>
        <View style={s.barraFondo}>
          <View style={[s.barraRelleno, { width: `${global.pct}%` as any }]} />
        </View>
        <Text style={s.pctTexto}>{global.pct}% completado</Text>
      </View>

      <FlatList
        data={ambientes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item }) => {
          const { total, completadas, pct } = getProgreso(item.id);
          return (
            <TouchableOpacity
              style={[s.card, { borderLeftColor: item.color || grupo!.color }]}
              onPress={() => router.push(`/checklist/${grupo!.id}/${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={[s.iconoBadge, { backgroundColor: item.color || grupo!.color }]}>
                <Ionicons name={(item.icono || 'home-outline') as any} size={26} color="#fff" />
              </View>
              <View style={s.cardInfo}>
                <Text style={s.cardNombre}>{item.nombre}</Text>
                <Text style={s.cardSub}>{(item.secciones || []).length} secciones · {completadas}/{total}</Text>
                <View style={s.barraFondoSm}>
                  <View style={[s.barraRellenoSm, { width: `${pct}%` as any, backgroundColor: item.color || grupo!.color }]} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="construct-outline" size={60} color="#bdbdbd" />
            <Text style={s.emptyTexto}>Sin ambientes aún</Text>
          </View>
        }
      />
    </View>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { isAdmin } = useAuthCtx();
  return isAdmin ? <AdminView /> : <UsuarioView />;
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f5f5f5' },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingTexto:{ marginTop: 12, color: '#555', fontSize: 16 },
  errorTitulo: { fontSize: 18, fontWeight: '700', color: '#212121', marginTop: 12 },
  errorSub:    { fontSize: 14, color: '#9e9e9e', textAlign: 'center', marginTop: 6 },
  btnSalir:    { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#1a237e', borderRadius: 12 },
  btnSalirTexto:{ color: '#fff', fontWeight: '700' },
  header:      { backgroundColor: '#1a237e', paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub:   { color: '#c5cae9', fontSize: 13, marginTop: 2 },
  headerActions:{ flexDirection: 'row', gap: 8 },
  headerBtn:   { padding: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 },
  barraFondo:  { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden', marginTop: 10 },
  barraRelleno:{ height: 8, backgroundColor: '#fff', borderRadius: 4 },
  pctTexto:    { color: '#c5cae9', fontSize: 11, marginTop: 4, textAlign: 'right' },
  grupoBadge:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start', marginTop: 10 },
  grupoDot:    { width: 8, height: 8, borderRadius: 4 },
  grupoTexto:  { fontSize: 12, fontWeight: '700' },
  resumen:     { backgroundColor: '#fff', marginHorizontal: 16, marginTop: -10, borderRadius: 12, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  resumenTexto:{ fontSize: 13, color: '#546e7a', marginBottom: 6 },
  // Cards usuario
  card:        { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderLeftWidth: 5, flexDirection: 'row', alignItems: 'center', padding: 14, elevation: 2 },
  iconoBadge:  { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardInfo:    { flex: 1 },
  cardNombre:  { fontSize: 16, fontWeight: '700', color: '#212121' },
  cardSub:     { fontSize: 12, color: '#78909c', marginTop: 2, marginBottom: 6 },
  // Admin cards
  grupoCard:   { backgroundColor: '#fff', borderRadius: 14, marginBottom: 16, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4 },
  grupoHeader: { flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, paddingLeft: 10, marginBottom: 8 },
  grupoNombre: { fontSize: 16, fontWeight: '700', color: '#212121' },
  grupoSub:    { fontSize: 12, color: '#78909c', marginTop: 2 },
  grupoPct:    { fontSize: 22, fontWeight: '800' },
  sinUsuarios: { fontSize: 13, color: '#bdbdbd', textAlign: 'center', paddingVertical: 8 },
  usuarioRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  avatar:      { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  avatarLetra: { fontSize: 16, fontWeight: '700' },
  usuarioNombre:{ fontSize: 14, fontWeight: '600', color: '#212121' },
  ultimaAct:   { fontSize: 11, color: '#9e9e9e', marginTop: 1 },
  usuarioPct:  { fontSize: 18, fontWeight: '700', flexShrink: 0 },
  barraFondoSm:{ height: 5, backgroundColor: '#eeeeee', borderRadius: 3, overflow: 'hidden', marginTop: 4 },
  barraRellenoSm:{ height: 5, borderRadius: 3 },
  barraFondoXs:{ height: 4, backgroundColor: '#eeeeee', borderRadius: 2, overflow: 'hidden', marginTop: 4 },
  barraRellenoXs:{ height: 4, borderRadius: 2 },
  empty:       { alignItems: 'center', marginTop: 60 },
  emptyTexto:  { fontSize: 18, color: '#9e9e9e', marginTop: 12 },
  emptySub:    { fontSize: 13, color: '#bdbdbd', marginTop: 4 },
});
