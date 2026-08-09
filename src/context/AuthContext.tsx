import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut as fbSignOut, User
} from "firebase/auth";
import { auth } from "../firebase/config";
import { getUserProfile } from "../firebase/firestore";
import type { UserProfile } from "../types/firebase";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuthCtx = () => useContext(AuthContext);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.uid);
        setProfile(p as UserProfile | null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const p = await getUserProfile(cred.user.uid);
    if (!p) throw new Error("Usuario no encontrado en el sistema.");
    if ((p as any).rol === "admin") throw new Error("Usa el panel web para acceder como admin.");
    if (!(p as any).activo) throw new Error("Tu cuenta está desactivada. Contacta al administrador.");
    setProfile(p as UserProfile);
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
