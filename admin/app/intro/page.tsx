"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SERVICIOS = [
  "Limpieza de la Sala",
  "Limpieza de la Cocina",
  "Habitación Principal",
  "Habitación Mediana",
  "Habitación Pequeña",
  "Lavatorio",
  "Baño Principal",
  "Baño Secundario",
  "Comedor",
  "Lavandería",
  "Almacén General",
  "Terraza",
  "Estacionamiento",
];

export default function IntroPage() {
  const router = useRouter();
  const [indice, setIndice]   = useState(0);
  const [visible, setVisible] = useState(true);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    let i = 0;
    const run = () => {
      setVisible(false);
      setTimeout(() => {
        i++;
        if (i >= SERVICIOS.length) {
          router.replace("/login");
          return;
        }
        setIndice(i);
        setVisible(true);
        setTimeout(run, 400);
      }, 200);
    };
    setTimeout(run, 800);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0d1b5e",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>

      {/* UNA SOLA LÍNEA HORIZONTAL */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        whiteSpace: "nowrap",
      }}>
        {/* Fijo izquierda */}
        <span style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: 4,
        }}>
          DEPA 804
        </span>

        {/* Separador */}
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 28 }}>|</span>

        {/* Cambia derecha */}
        <span style={{
          fontSize: 20,
          fontWeight: 300,
          color: "rgba(255,255,255,0.85)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}>
          {SERVICIOS[indice]}
        </span>
      </div>

      {/* Botón al terminar */}
      <div style={{
        marginTop: 64,
        opacity: showBtn ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>
        <button
          onClick={() => router.replace("/login")}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 40,
            padding: "14px 52px",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
