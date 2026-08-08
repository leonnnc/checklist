import { AppData } from '../types';

export const INITIAL_DATA: AppData = {
  ultimaActualizacion: new Date().toISOString(),
  almacen: {
    secciones: [
      {
        id: 'alm-1',
        nombre: 'Productos de Limpieza',
        items: [
          { id: 'alm-1-1', nombre: 'Cloro / Blanqueador', cantidad: 2, unidad: 'litros', minimo: 1 },
          { id: 'alm-1-2', nombre: 'Desengrasante multiusos', cantidad: 1, unidad: 'litros', minimo: 1 },
          { id: 'alm-1-3', nombre: 'Limpiador de baño', cantidad: 2, unidad: 'piezas', minimo: 1 },
          { id: 'alm-1-4', nombre: 'Jabón líquido para trastes', cantidad: 1, unidad: 'litros', minimo: 1 },
          { id: 'alm-1-5', nombre: 'Limpiador de pisos', cantidad: 1, unidad: 'litros', minimo: 1 },
          { id: 'alm-1-6', nombre: 'Aromatizante ambiental', cantidad: 3, unidad: 'piezas', minimo: 2 },
        ],
      },
      {
        id: 'alm-2',
        nombre: 'Utensilios de Limpieza',
        items: [
          { id: 'alm-2-1', nombre: 'Trapeador', cantidad: 1, unidad: 'piezas', minimo: 1 },
          { id: 'alm-2-2', nombre: 'Escoba', cantidad: 1, unidad: 'piezas', minimo: 1 },
          { id: 'alm-2-3', nombre: 'Recogedor', cantidad: 1, unidad: 'piezas', minimo: 1 },
          { id: 'alm-2-4', nombre: 'Cepillo de baño', cantidad: 2, unidad: 'piezas', minimo: 2 },
          { id: 'alm-2-5', nombre: 'Jalador de agua', cantidad: 1, unidad: 'piezas', minimo: 1 },
          { id: 'alm-2-6', nombre: 'Esponja de cocina', cantidad: 4, unidad: 'piezas', minimo: 2 },
          { id: 'alm-2-7', nombre: 'Guantes de hule', cantidad: 2, unidad: 'pares', minimo: 1 },
          { id: 'alm-2-8', nombre: 'Bolsas de basura grandes', cantidad: 20, unidad: 'piezas', minimo: 10 },
          { id: 'alm-2-9', nombre: 'Bolsas de basura chicas', cantidad: 30, unidad: 'piezas', minimo: 15 },
          { id: 'alm-2-10', nombre: 'Papel de cocina (rollos)', cantidad: 3, unidad: 'rollos', minimo: 2 },
        ],
      },
    ],
  },
  ambientes: [
    // ── SALA ───────────────────────────────────────
    {
      id: 'amb-sala',
      nombre: 'Sala',
      icono: 'tv-outline',
      color: '#3f51b5',
      seccionesLimpieza: [
        {
          id: 'sala-limp-1',
          nombre: 'Sofá',
          tareas: [
            { id: 't1', nombre: 'Retirar cojines y sacudir', estado: 'pendiente' },
            { id: 't2', nombre: 'Aspirar o cepillar tapizado', estado: 'pendiente' },
            { id: 't3', nombre: 'Limpiar manchas con paño húmedo', estado: 'pendiente' },
            { id: 't4', nombre: 'Acomodar cojines', estado: 'pendiente' },
          ],
        },
        {
          id: 'sala-limp-2',
          nombre: 'Mesa de Centro',
          tareas: [
            { id: 't5', nombre: 'Retirar objetos y despejar', estado: 'pendiente' },
            { id: 't6', nombre: 'Limpiar superficie con limpiador', estado: 'pendiente' },
            { id: 't7', nombre: 'Secar y pulir', estado: 'pendiente' },
          ],
        },
        {
          id: 'sala-limp-3',
          nombre: 'Mueble Multimedia / TV',
          tareas: [
            { id: 't8', nombre: 'Desempolvar TV con paño de microfibra', estado: 'pendiente' },
            { id: 't9', nombre: 'Limpiar controles remotos', estado: 'pendiente' },
            { id: 't10', nombre: 'Limpiar consola / decodificador / bocinas', estado: 'pendiente' },
            { id: 't11', nombre: 'Limpiar mueble (puertas, cajones, estantes)', estado: 'pendiente' },
            { id: 't12', nombre: 'Organizar cables', estado: 'pendiente' },
          ],
        },
        {
          id: 'sala-limp-4',
          nombre: 'Pisos y General',
          tareas: [
            { id: 't13', nombre: 'Barrer / aspirar piso', estado: 'pendiente' },
            { id: 't14', nombre: 'Trapear piso', estado: 'pendiente' },
            { id: 't15', nombre: 'Limpiar ventanas y cortinas', estado: 'pendiente' },
            { id: 't16', nombre: 'Limpiar lámparas y focos', estado: 'pendiente' },
          ],
        },
      ],
      seccionesInventario: [
        {
          id: 'sala-inv-1',
          nombre: 'Electrónica',
          items: [
            { id: 'si1', nombre: 'Televisión', cantidad: 1, unidad: 'pieza' },
            { id: 'si2', nombre: 'Control remoto TV', cantidad: 1, unidad: 'pieza' },
            { id: 'si3', nombre: 'Decodificador / Cablebox', cantidad: 1, unidad: 'pieza' },
            { id: 'si4', nombre: 'Bocinas / Soundbar', cantidad: 1, unidad: 'pieza' },
          ],
        },
        {
          id: 'sala-inv-2',
          nombre: 'Mobiliario',
          items: [
            { id: 'si5', nombre: 'Sofá de 3 plazas', cantidad: 1, unidad: 'pieza' },
            { id: 'si6', nombre: 'Sillón individual', cantidad: 2, unidad: 'piezas' },
            { id: 'si7', nombre: 'Mesa de centro', cantidad: 1, unidad: 'pieza' },
            { id: 'si8', nombre: 'Mueble multimedia', cantidad: 1, unidad: 'pieza' },
          ],
        },
      ],
    },
    // ── COCINA ─────────────────────────────────────
    {
      id: 'amb-cocina',
      nombre: 'Cocina',
      icono: 'restaurant-outline',
      color: '#e65100',
      seccionesLimpieza: [
        {
          id: 'coc-limp-1',
          nombre: 'Estufa y Campana',
          tareas: [
            { id: 'c1', nombre: 'Retirar parrillas y limpiar a fondo', estado: 'pendiente' },
            { id: 'c2', nombre: 'Limpiar quemadores', estado: 'pendiente' },
            { id: 'c3', nombre: 'Desengrasante en superficie de estufa', estado: 'pendiente' },
            { id: 'c4', nombre: 'Limpiar campana extractora y filtros', estado: 'pendiente' },
          ],
        },
        {
          id: 'coc-limp-2',
          nombre: 'Refrigerador',
          tareas: [
            { id: 'c5', nombre: 'Limpiar exterior con paño húmedo', estado: 'pendiente' },
            { id: 'c6', nombre: 'Vaciar y limpiar interior (repisas y cajones)', estado: 'pendiente' },
            { id: 'c7', nombre: 'Limpiar sellos de puerta', estado: 'pendiente' },
            { id: 'c8', nombre: 'Desechar alimentos vencidos', estado: 'pendiente' },
          ],
        },
        {
          id: 'coc-limp-3',
          nombre: 'Fregadero y Tarja',
          tareas: [
            { id: 'c9', nombre: 'Limpiar tarja con desengrasante', estado: 'pendiente' },
            { id: 'c10', nombre: 'Limpiar llave y grifo', estado: 'pendiente' },
            { id: 'c11', nombre: 'Desinfectar coladera', estado: 'pendiente' },
          ],
        },
        {
          id: 'coc-limp-4',
          nombre: 'Gabinetes y Despensa',
          tareas: [
            { id: 'c12', nombre: 'Limpiar puertas de gabinetes', estado: 'pendiente' },
            { id: 'c13', nombre: 'Organizar y limpiar interior de gabinetes', estado: 'pendiente' },
            { id: 'c14', nombre: 'Limpiar encimera / barra', estado: 'pendiente' },
            { id: 'c15', nombre: 'Barrer y trapear piso de cocina', estado: 'pendiente' },
          ],
        },
        {
          id: 'coc-limp-5',
          nombre: 'Microondas y Electrodomésticos',
          tareas: [
            { id: 'c16', nombre: 'Limpiar interior de microondas', estado: 'pendiente' },
            { id: 'c17', nombre: 'Limpiar exterior de microondas', estado: 'pendiente' },
            { id: 'c18', nombre: 'Limpiar cafetera / tostador', estado: 'pendiente' },
            { id: 'c19', nombre: 'Limpiar licuadora / procesadora', estado: 'pendiente' },
          ],
        },
      ],
      seccionesInventario: [
        {
          id: 'coc-inv-1',
          nombre: 'Electrodomésticos',
          items: [
            { id: 'ci1', nombre: 'Refrigerador', cantidad: 1, unidad: 'pieza' },
            { id: 'ci2', nombre: 'Estufa con horno', cantidad: 1, unidad: 'pieza' },
            { id: 'ci3', nombre: 'Microondas', cantidad: 1, unidad: 'pieza' },
            { id: 'ci4', nombre: 'Licuadora', cantidad: 1, unidad: 'pieza' },
            { id: 'ci5', nombre: 'Cafetera', cantidad: 1, unidad: 'pieza' },
            { id: 'ci6', nombre: 'Tostador', cantidad: 1, unidad: 'pieza' },
          ],
        },
        {
          id: 'coc-inv-2',
          nombre: 'Utensilios de Cocina',
          items: [
            { id: 'ci7', nombre: 'Sartén antiadherente', cantidad: 2, unidad: 'piezas' },
            { id: 'ci8', nombre: 'Ollas', cantidad: 3, unidad: 'piezas' },
            { id: 'ci9', nombre: 'Cuchillos', cantidad: 5, unidad: 'piezas' },
            { id: 'ci10', nombre: 'Tabla para picar', cantidad: 2, unidad: 'piezas' },
            { id: 'ci11', nombre: 'Cucharas de madera', cantidad: 4, unidad: 'piezas' },
          ],
        },
        {
          id: 'coc-inv-3',
          nombre: 'Vajilla y Cristalería',
          items: [
            { id: 'ci12', nombre: 'Platos extendidos', cantidad: 6, unidad: 'piezas' },
            { id: 'ci13', nombre: 'Platos hondos', cantidad: 6, unidad: 'piezas' },
            { id: 'ci14', nombre: 'Vasos', cantidad: 8, unidad: 'piezas' },
            { id: 'ci15', nombre: 'Tazas', cantidad: 6, unidad: 'piezas' },
            { id: 'ci16', nombre: 'Cubiertos (juego)', cantidad: 1, unidad: 'juego' },
          ],
        },
      ],
    },
    // ── HABITACIÓN PRINCIPAL ───────────────────────
    {
      id: 'amb-hab-principal',
      nombre: 'Habitación Principal',
      icono: 'bed-outline',
      color: '#7b1fa2',
      seccionesLimpieza: [
        {
          id: 'hab-limp-1',
          nombre: 'Cama y Ropa de Cama',
          tareas: [
            { id: 'h1', nombre: 'Cambiar sábanas y fundas', estado: 'pendiente' },
            { id: 'h2', nombre: 'Sacudir almohadas', estado: 'pendiente' },
            { id: 'h3', nombre: 'Hacer cama', estado: 'pendiente' },
            { id: 'h4', nombre: 'Limpiar cabecera', estado: 'pendiente' },
          ],
        },
        {
          id: 'hab-limp-2',
          nombre: 'Closet y Muebles',
          tareas: [
            { id: 'h5', nombre: 'Organizar ropa en closet', estado: 'pendiente' },
            { id: 'h6', nombre: 'Limpiar espejo del closet', estado: 'pendiente' },
            { id: 'h7', nombre: 'Desempolvar buró', estado: 'pendiente' },
            { id: 'h8', nombre: 'Limpiar cómoda', estado: 'pendiente' },
          ],
        },
        {
          id: 'hab-limp-3',
          nombre: 'General',
          tareas: [
            { id: 'h9', nombre: 'Barrer / aspirar piso', estado: 'pendiente' },
            { id: 'h10', nombre: 'Trapear piso', estado: 'pendiente' },
            { id: 'h11', nombre: 'Limpiar ventanas', estado: 'pendiente' },
            { id: 'h12', nombre: 'Desempolvar techo y rincones', estado: 'pendiente' },
          ],
        },
      ],
      seccionesInventario: [
        {
          id: 'hab-inv-1',
          nombre: 'Mobiliario',
          items: [
            { id: 'hi1', nombre: 'Cama matrimonial', cantidad: 1, unidad: 'pieza' },
            { id: 'hi2', nombre: 'Colchón', cantidad: 1, unidad: 'pieza' },
            { id: 'hi3', nombre: 'Buró', cantidad: 2, unidad: 'piezas' },
            { id: 'hi4', nombre: 'Cómoda', cantidad: 1, unidad: 'pieza' },
            { id: 'hi5', nombre: 'Closet empotrado', cantidad: 1, unidad: 'pieza' },
          ],
        },
        {
          id: 'hab-inv-2',
          nombre: 'Ropa de Cama',
          items: [
            { id: 'hi6', nombre: 'Juego de sábanas', cantidad: 2, unidad: 'juegos' },
            { id: 'hi7', nombre: 'Almohadas', cantidad: 4, unidad: 'piezas' },
            { id: 'hi8', nombre: 'Cobertores / Edredón', cantidad: 2, unidad: 'piezas' },
          ],
        },
      ],
    },
    // ── BAÑO ───────────────────────────────────────
    {
      id: 'amb-bano',
      nombre: 'Baño',
      icono: 'water-outline',
      color: '#00897b',
      seccionesLimpieza: [
        {
          id: 'bano-limp-1',
          nombre: 'WC / Inodoro',
          tareas: [
            { id: 'b1', nombre: 'Limpiar y desinfectar interior del WC', estado: 'pendiente' },
            { id: 'b2', nombre: 'Limpiar tapa, asiento y base', estado: 'pendiente' },
            { id: 'b3', nombre: 'Limpiar tanque exterior', estado: 'pendiente' },
          ],
        },
        {
          id: 'bano-limp-2',
          nombre: 'Lavabo y Espejo',
          tareas: [
            { id: 'b4', nombre: 'Limpiar lavabo y grifo', estado: 'pendiente' },
            { id: 'b5', nombre: 'Limpiar espejo sin rayas', estado: 'pendiente' },
            { id: 'b6', nombre: 'Limpiar repisa o mueble del lavabo', estado: 'pendiente' },
          ],
        },
        {
          id: 'bano-limp-3',
          nombre: 'Regadera / Tina',
          tareas: [
            { id: 'b7', nombre: 'Limpiar paredes de azulejo con desengrasante', estado: 'pendiente' },
            { id: 'b8', nombre: 'Limpiar regadera y llaves', estado: 'pendiente' },
            { id: 'b9', nombre: 'Limpiar cortina de baño o mampara', estado: 'pendiente' },
            { id: 'b10', nombre: 'Desinfectar coladera', estado: 'pendiente' },
          ],
        },
        {
          id: 'bano-limp-4',
          nombre: 'General',
          tareas: [
            { id: 'b11', nombre: 'Trapear piso con cloro', estado: 'pendiente' },
            { id: 'b12', nombre: 'Cambiar tapetes de baño', estado: 'pendiente' },
            { id: 'b13', nombre: 'Reponer papel higiénico y jabón', estado: 'pendiente' },
          ],
        },
      ],
      seccionesInventario: [
        {
          id: 'bano-inv-1',
          nombre: 'Artículos de Baño',
          items: [
            { id: 'bni1', nombre: 'Papel higiénico (rollos)', cantidad: 6, unidad: 'rollos', minimo: 4 },
            { id: 'bni2', nombre: 'Jabón líquido de manos', cantidad: 2, unidad: 'piezas', minimo: 1 },
            { id: 'bni3', nombre: 'Shampoo', cantidad: 1, unidad: 'pieza', minimo: 1 },
            { id: 'bni4', nombre: 'Acondicionador', cantidad: 1, unidad: 'pieza', minimo: 1 },
            { id: 'bni5', nombre: 'Gel de baño', cantidad: 2, unidad: 'piezas', minimo: 1 },
            { id: 'bni6', nombre: 'Toallas de baño', cantidad: 4, unidad: 'piezas', minimo: 2 },
          ],
        },
      ],
    },
    // ── COMEDOR ────────────────────────────────────
    {
      id: 'amb-comedor',
      nombre: 'Comedor',
      icono: 'pizza-outline',
      color: '#f57f17',
      seccionesLimpieza: [
        {
          id: 'com-limp-1',
          nombre: 'Mesa y Sillas',
          tareas: [
            { id: 'dm1', nombre: 'Limpiar superficie de la mesa', estado: 'pendiente' },
            { id: 'dm2', nombre: 'Limpiar patas de la mesa', estado: 'pendiente' },
            { id: 'dm3', nombre: 'Limpiar respaldo y asiento de sillas', estado: 'pendiente' },
            { id: 'dm4', nombre: 'Limpiar patas de sillas', estado: 'pendiente' },
          ],
        },
        {
          id: 'com-limp-2',
          nombre: 'General',
          tareas: [
            { id: 'dm5', nombre: 'Barrer piso bajo la mesa', estado: 'pendiente' },
            { id: 'dm6', nombre: 'Trapear piso', estado: 'pendiente' },
          ],
        },
      ],
      seccionesInventario: [
        {
          id: 'com-inv-1',
          nombre: 'Mobiliario',
          items: [
            { id: 'comi1', nombre: 'Mesa de comedor', cantidad: 1, unidad: 'pieza' },
            { id: 'comi2', nombre: 'Sillas', cantidad: 4, unidad: 'piezas' },
          ],
        },
      ],
    },
    // ── CUARTO DE SERVICIO / LAVANDERÍA ────────────
    {
      id: 'amb-lavanderia',
      nombre: 'Lavandería',
      icono: 'shirt-outline',
      color: '#546e7a',
      seccionesLimpieza: [
        {
          id: 'lav-limp-1',
          nombre: 'Lavadora y Secadora',
          tareas: [
            { id: 'lv1', nombre: 'Limpiar tambor de lavadora', estado: 'pendiente' },
            { id: 'lv2', nombre: 'Limpiar dispensadores de detergente', estado: 'pendiente' },
            { id: 'lv3', nombre: 'Limpiar exterior de lavadora y secadora', estado: 'pendiente' },
            { id: 'lv4', nombre: 'Revisar y limpiar filtros de secadora', estado: 'pendiente' },
          ],
        },
        {
          id: 'lav-limp-2',
          nombre: 'General',
          tareas: [
            { id: 'lv5', nombre: 'Organizar ropa sucia y limpia', estado: 'pendiente' },
            { id: 'lv6', nombre: 'Barrer y trapear piso', estado: 'pendiente' },
          ],
        },
      ],
      seccionesInventario: [
        {
          id: 'lav-inv-1',
          nombre: 'Productos de Lavandería',
          items: [
            { id: 'lvi1', nombre: 'Detergente para ropa (kg)', cantidad: 2, unidad: 'kg', minimo: 1 },
            { id: 'lvi2', nombre: 'Suavizante de telas', cantidad: 1, unidad: 'litros', minimo: 1 },
            { id: 'lvi3', nombre: 'Blanqueador para ropa', cantidad: 1, unidad: 'litros', minimo: 1 },
          ],
        },
        {
          id: 'lav-inv-2',
          nombre: 'Equipos',
          items: [
            { id: 'lvi4', nombre: 'Lavadora', cantidad: 1, unidad: 'pieza' },
            { id: 'lvi5', nombre: 'Tendedero', cantidad: 1, unidad: 'pieza' },
          ],
        },
      ],
    },
  ],
};
