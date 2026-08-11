"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut, User
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

// Intenta leer el perfil hasta 3 veces con pausa entre intentos
async function fetchRolWithRetry(uid: string, attempts = 3): Promise<string | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const snap = await getDoc(doc(db, "usuarios", uid));
      return snap.data()?.rol ?? null;
    } catch (e: any) {
      if (i < attempts - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const rol = await fetchRolWithRetry(u.uid);
        if (rol === "admin") {
          setIsAdmin(true);
        } else {
          // Si no es admin o no se pudo leer, cerrar sesión
          setIsAdmin(false);
          await signOut(auth);
          setUser(null);
          if (pathname !== "/login") router.replace("/login");
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const rol  = await fetchRolWithRetry(cred.user.uid);
    if (rol !== "admin") {
      await signOut(auth);
      throw new Error("Solo los administradores pueden acceder a este panel.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/intro");
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
