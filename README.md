# 🏠 Depa 804 — Checklist de Limpieza e Inventario

App móvil cross-platform (Android e iOS) para gestionar la limpieza general e inventario del Departamento 804. Construida con React Native + Expo.

---

## 📱 Capturas de pantalla

| Inicio | Checklist | Inventario | Almacén |
|--------|-----------|------------|---------|
| Lista de ambientes con progreso | Tareas por sección | Artículos por ambiente | Inventario central |

---

## ✨ Características

- **Checklist de limpieza** por ambiente con secciones personalizables
- **Inventario** individual por ambiente (electrodomésticos, mobiliario, consumibles, etc.)
- **Almacén general** con todos los productos de limpieza y utensilios
- **Alertas de stock bajo** cuando un artículo cae por debajo del mínimo definido
- **Barra de progreso** global y por ambiente
- **Fecha y hora** de completado en cada tarea
- **Reinicio de checklist** con un tap para empezar una nueva limpieza
- **Agregar/eliminar** ambientes, secciones, tareas y artículos en tiempo real
- **Persistencia local** con AsyncStorage — funciona sin internet
- Soporte completo **Android e iOS**

---

## 🏠 Ambientes pre-cargados

| Ambiente | Secciones de limpieza | Secciones de inventario |
|---|---|---|
| 🛋️ Sala | Sofá, Mesa de Centro, TV/Multimedia, Pisos | Electrónica, Mobiliario |
| 🍳 Cocina | Estufa, Refrigerador, Tarja, Gabinetes, Microondas | Electrodomésticos, Utensilios, Vajilla |
| 🛏️ Habitación Principal | Cama, Closet y Muebles, General | Mobiliario, Ropa de cama |
| 🚿 Baño | WC/Inodoro, Lavabo/Espejo, Regadera, General | Artículos de baño |
| 🍕 Comedor | Mesa y Sillas, General | Mobiliario |
| 👕 Lavandería | Lavadora y Secadora, General | Productos, Equipos |

### Almacén General pre-cargado
- **Productos de Limpieza**: Cloro, desengrasante, limpiador de baño, jabón, aromatizante, etc.
- **Utensilios de Limpieza**: Trapeador, escoba, cepillo, esponjas, guantes, bolsas, etc.

---

## 🗂️ Estructura del proyecto

```
depa804/
├── app/
│   ├── _layout.tsx                    # Layout raíz con AppProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx                # Navegación por tabs
│   │   ├── index.tsx                  # Pantalla Inicio — lista de ambientes
│   │   └── almacen.tsx                # Pantalla Almacén general
│   └── ambiente/
│       ├── [id].tsx                   # Checklist de limpieza por ambiente
│       └── inventario/
│           └── [id].tsx               # Inventario por ambiente
├── src/
│   ├── types/
│   │   └── index.ts                   # Tipos TypeScript globales
│   ├── data/
│   │   └── initialData.ts             # Datos iniciales del Depa 804
│   ├── storage/
│   │   └── storage.ts                 # AsyncStorage (guardar/cargar datos)
│   └── context/
│       └── AppContext.tsx             # Context global + todas las operaciones CRUD
├── assets/                            # Íconos y splash screen
├── app.json                           # Configuración Expo
├── package.json
├── babel.config.js
└── tsconfig.json
```

---

## 🚀 Instalación y uso

### Requisitos previos

- [Node.js](https://nodejs.org) v18 o superior
- [Expo Go](https://expo.dev/go) instalado en tu teléfono (Android o iOS)
- Teléfono y PC en la **misma red WiFi**

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/leonnnc/checklist.git
cd checklist

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npx expo start
```

Escanea el QR que aparece en la terminal con la app **Expo Go**.

### Comandos disponibles

```bash
npx expo start          # Inicia en modo desarrollo
npx expo start --android  # Abre en emulador Android
npx expo start --ios      # Abre en simulador iOS
```

---

## 📦 Tecnologías

| Librería | Versión | Uso |
|---|---|---|
| [Expo](https://expo.dev) | ~51.0.0 | Framework principal |
| [React Native](https://reactnative.dev) | 0.74.5 | UI móvil |
| [Expo Router](https://expo.github.io/router) | ~3.5.0 | Navegación basada en archivos |
| [@expo/vector-icons](https://icons.expo.fyi) | ^14.0.2 | Íconos (Ionicons) |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) | 1.23.1 | Persistencia local |
| [TypeScript](https://www.typescriptlang.org) | ~5.3.3 | Tipado estático |

---

## 🧩 Cómo usar la app

### Agregar un ambiente nuevo
1. En la pantalla **Inicio**, toca el botón **+** (abajo a la derecha)
2. Escribe el nombre, elige un ícono y un color
3. Toca **Agregar**

### Hacer el checklist de limpieza
1. Toca un ambiente en la lista
2. Toca cualquier tarea para marcarla como ✅ completada
3. Toca de nuevo para desmarcarla
4. Usa el botón **🔄** (arriba a la derecha) para reiniciar todas las tareas

### Agregar secciones y tareas
- En la pantalla de un ambiente, toca **+** para agregar una nueva sección
- Dentro de una sección, toca el ícono **＋⭕** para agregar una tarea
- Mantén presionada una tarea para eliminarla

### Gestionar inventario
1. Desde la tarjeta del ambiente toca **Inventario**, o desde dentro del ambiente
2. Toca **+** para agregar una sección de inventario
3. Dentro de la sección, toca **＋⭕** para agregar un artículo
4. Define nombre, cantidad, unidad y un **mínimo** para recibir alertas de stock bajo ⚠️
5. Toca un artículo para editarlo · Mantén presionado para eliminarlo

### Almacén General
- Accede desde el tab **Almacén** en la barra inferior
- Mismo funcionamiento que el inventario por ambiente
- Muestra un banner de alerta si algún artículo está bajo el mínimo

---

## 💾 Modelo de datos

```typescript
AppData
├── ambientes: Ambiente[]
│   ├── id, nombre, icono, color
│   ├── seccionesLimpieza: SeccionLimpieza[]
│   │   └── tareas: TareaLimpieza[]  (estado: pendiente | completado)
│   └── seccionesInventario: SeccionInventario[]
│       └── items: ItemInventario[]  (cantidad, unidad, minimo)
└── almacen: Almacen
    └── secciones: SeccionInventario[]
```

Todos los datos se almacenan localmente en el dispositivo mediante `AsyncStorage`. No requiere backend ni conexión a internet.

---

## 🔧 Personalización

Puedes editar los datos iniciales del departamento en:
```
src/data/initialData.ts
```

Para cambiar los íconos disponibles o la paleta de colores al crear ambientes, edita:
```
app/(tabs)/index.tsx  →  constantes ICONOS y COLORES
```

---

## 📄 Licencia

MIT — libre para uso personal y comercial.
