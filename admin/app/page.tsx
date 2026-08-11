"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Siempre pasar por intro primero
      router.replace("/intro");
    }
  }, [loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a237e]">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
