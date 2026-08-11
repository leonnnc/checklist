import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCD2ghDCVV1cyWr6zBT2dtL4qy9jP_pYM0",
  authDomain: "depa804-d7c90.firebaseapp.com",
  projectId: "depa804-d7c90",
  storageBucket: "depa804-d7c90.firebasestorage.app",
  messagingSenderId: "647429660414",
  appId: "1:647429660414:web:930e79eb1dc3332d23cfaf",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

// ─────────────────────────────────────────────────────────────────────────────
//  DATOS DEL DEPA 804
// ─────────────────────────────────────────────────────────────────────────────

const GRUPOS = [
  {
    nombre: "Limpieza Profunda",
    descripcion: "Limpieza completa de todos los ambientes del departamento",
    color: "#1a237e",
    ambientes: [
      {
        nombre: "Sala",
        icono: "tv-outline",
        color: "#3f51b5",
        secciones: [
          {
            nombre: "Sofá",
            tareas: [
              "Retirar cojines y sacudir",
              "Aspirar o cepillar tapizado",
              "Limpiar manchas con paño húmedo",
              "Acomodar cojines",
            ],
          },
          {
            nombre: "Mesa de Centro",
            tareas: [
              "Retirar objetos y despejar",
              "Limpiar superficie con limpiador",
              "Secar y pulir",
            ],
          },
          {
            nombre: "Mueble Multimedia / TV",
            tareas: [
              "Desempolvar TV con paño de microfibra",
              "Limpiar controles remotos",
              "Limpiar consola / decodificador / bocinas",
              "Limpiar mueble (puertas, cajones, estantes)",
              "Organizar cables",
            ],
          },
          {
            nombre: "Pisos y General",
            tareas: [
              "Barrer / aspirar piso",
              "Trapear piso",
              "Limpiar ventanas y cortinas",
              "Limpiar lámparas y focos",
            ],
          },
        ],
      },
      {
        nombre: "Cocina",
        icono: "restaurant-outline",
        color: "#e65100",
        secciones: [
          {
            nombre: "Estufa y Campana",
            tareas: [
              "Retirar parrillas y limpiar a fondo",
              "Limpiar quemadores",
              "Desengrasante en superficie de estufa",
              "Limpiar campana extractora y filtros",
            ],
          },
          {
            nombre: "Refrigerador",
            tareas: [
              "Limpiar exterior con paño húmedo",
              "Vaciar y limpiar interior (repisas y cajones)",
              "Limpiar sellos de puerta",
              "Desechar alimentos vencidos",
            ],
          },
          {
            nombre: "Fregadero y Tarja",
            tareas: [
              "Limpiar tarja con desengrasante",
              "Limpiar llave y grifo",
              "Desinfectar coladera",
            ],
          },
          {
            nombre: "Gabinetes y Despensa",
            tareas: [
              "Limpiar puertas de gabinetes",
              "Organizar y limpiar interior de gabinetes",
              "Limpiar encimera / barra",
              "Barrer y trapear piso de cocina",
            ],
          },
          {
            nombre: "Microondas y Electrodomésticos",
            tareas: [
              "Limpiar interior de microondas",
              "Limpiar exterior de microondas",
              "Limpiar cafetera / tostador",
              "Limpiar licuadora / procesadora",
            ],
          },
        ],
      },
      {
        nombre: "Habitación Principal",
        icono: "bed-outline",
        color: "#7b1fa2",
        secciones: [
          {
            nombre: "Cama y Ropa de Cama",
            tareas: [
              "Cambiar sábanas y fundas",
              "Sacudir almohadas",
              "Hacer cama",
              "Limpiar cabecera",
            ],
          },
          {
            nombre: "Closet y Muebles",
            tareas: [
              "Organizar ropa en closet",
              "Limpiar espejo del closet",
              "Desempolvar buró",
              "Limpiar cómoda",
            ],
          },
          {
            nombre: "General",
            tareas: [
              "Barrer / aspirar piso",
              "Trapear piso",
              "Limpiar ventanas",
              "Desempolvar techo y rincones",
            ],
          },
        ],
      },
      {
        nombre: "Baño",
        icono: "water-outline",
        color: "#00897b",
        secciones: [
          {
            nombre: "WC / Inodoro",
            tareas: [
              "Limpiar y desinfectar interior del WC",
              "Limpiar tapa, asiento y base",
              "Limpiar tanque exterior",
            ],
          },
          {
            nombre: "Lavabo y Espejo",
            tareas: [
              "Limpiar lavabo y grifo",
              "Limpiar espejo sin rayas",
              "Limpiar repisa o mueble del lavabo",
            ],
          },
          {
            nombre: "Regadera / Tina",
            tareas: [
              "Limpiar paredes de azulejo con desengrasante",
              "Limpiar regadera y llaves",
              "Limpiar cortina de baño o mampara",
              "Desinfectar coladera",
            ],
          },
          {
            nombre: "General",
            tareas: [
              "Trapear piso con cloro",
              "Cambiar tapetes de baño",
              "Reponer papel higiénico y jabón",
            ],
          },
        ],
      },
      {
        nombre: "Comedor",
        icono: "pizza-outline",
        color: "#f57f17",
        secciones: [
          {
            nombre: "Mesa y Sillas",
            tareas: [
              "Limpiar superficie de la mesa",
              "Limpiar patas de la mesa",
              "Limpiar respaldo y asiento de sillas",
              "Limpiar patas de sillas",
            ],
          },
          {
            nombre: "General",
            tareas: [
              "Barrer piso bajo la mesa",
              "Trapear piso",
            ],
          },
        ],
      },
      {
        nombre: "Lavandería",
        icono: "shirt-outline",
        color: "#546e7a",
        secciones: [
          {
            nombre: "Lavadora y Secadora",
            tareas: [
              "Limpiar tambor de lavadora",
              "Limpiar dispensadores de detergente",
              "Limpiar exterior de lavadora y secadora",
              "Revisar y limpiar filtros de secadora",
            ],
          },
          {
            nombre: "General",
            tareas: [
              "Organizar ropa sucia y limpia",
              "Barrer y trapear piso",
            ],
          },
        ],
      },
    ],
  },
  {
    nombre: "Limpieza Parcial",
    descripcion: "Limpieza rápida de las áreas principales del departamento",
    color: "#00897b",
    ambientes: [
      {
        nombre: "Sala",
        icono: "tv-outline",
        color: "#3f51b5",
        secciones: [
          {
            nombre: "General",
            tareas: [
              "Acomodar cojines del sofá",
              "Limpiar mesa de centro",
              "Barrer / aspirar piso",
              "Trapear piso",
            ],
          },
        ],
      },
      {
        nombre: "Cocina",
        icono: "restaurant-outline",
        color: "#e65100",
        secciones: [
          {
            nombre: "General",
            tareas: [
              "Limpiar superficie de estufa",
              "Limpiar tarja",
              "Limpiar encimera / barra",
              "Barrer y trapear piso",
            ],
          },
        ],
      },
      {
        nombre: "Baño",
        icono: "water-outline",
        color: "#00897b",
        secciones: [
          {
            nombre: "General",
            tareas: [
              "Limpiar y desinfectar WC",
              "Limpiar lavabo y espejo",
              "Trapear piso con cloro",
              "Reponer papel higiénico y jabón",
            ],
          },
        ],
      },
      {
        nombre: "Habitación Principal",
        icono: "bed-outline",
        color: "#7b1fa2",
        secciones: [
          {
            nombre: "General",
            tareas: [
              "Hacer cama",
              "Recoger y ordenar",
              "Barrer / aspirar piso",
              "Trapear piso",
            ],
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Iniciando sesión como admin...");
  await signInWithEmailAndPassword(auth, "admin@depa804.com", "Admindepa804");
  console.log("✅ Login OK\n");

  for (const grupo of GRUPOS) {
    console.log(`📋 Creando grupo: "${grupo.nombre}"...`);

    // Construir ambientes con IDs
    const ambientes = grupo.ambientes.map(amb => ({
      id: uid(),
      nombre: amb.nombre,
      icono: amb.icono,
      color: amb.color,
      secciones: amb.secciones.map(sec => ({
        id: uid(),
        nombre: sec.nombre,
        tareas: sec.tareas.map(t => ({
          id: uid(),
          nombre: t,
        })),
      })),
    }));

    const totalTareas = ambientes.flatMap(a => a.secciones.flatMap(s => s.tareas)).length;

    const ref = await addDoc(collection(db, "grupos"), {
      nombre: grupo.nombre,
      descripcion: grupo.descripcion,
      color: grupo.color,
      ambientes,
      creadoEn: new Date().toISOString(),
    });

    console.log(`   ✅ ID: ${ref.id}`);
    console.log(`   📍 ${ambientes.length} ambientes, ${totalTareas} tareas totales\n`);
  }

  console.log("🎉 ¡Datos cargados correctamente!");
  console.log("   Recarga el dashboard en http://localhost:3000/dashboard");
  process.exit(0);
}

seed().catch(e => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
