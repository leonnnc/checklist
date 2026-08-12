"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { LayoutDashboard, Users, Layers, BarChart2, LogOut, Menu, X } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/grupos",    label: "Grupos",     icon: Layers },
  { href: "/usuarios",  label: "Usuarios",   icon: Users },
  { href: "/progreso",  label: "Progreso",   icon: BarChart2 },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition",
                active ? "bg-white text-blue-900" : "text-blue-200 hover:bg-blue-800 hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-blue-800">
        <button
          onClick={() => { onClick?.(); logout(); }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── DESKTOP: sidebar fijo ─────────────────────────────── */}
      <aside className="hidden md:flex w-64 min-h-screen bg-blue-900 flex-col shadow-xl flex-shrink-0">
        <div className="px-6 py-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div>
              <p className="text-white font-bold text-lg leading-none">Depa 804</p>
              <p className="text-blue-300 text-xs">Panel Admin</p>
            </div>
          </div>
        </div>
        <NavLinks />
      </aside>

      {/* ── MÓVIL: topbar + drawer ────────────────────────────── */}
      <div className="md:hidden">
        {/* Topbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-900 flex items-center justify-between px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <span className="text-white font-bold text-base">Depa 804</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="text-white p-1.5 rounded-lg hover:bg-blue-800 transition"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Espacio para que el contenido no quede bajo el topbar */}
        <div className="h-14" />

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Drawer */}
        <aside className={clsx(
          "fixed top-0 left-0 h-full w-72 bg-blue-900 z-50 flex flex-col shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="px-6 py-5 border-b border-blue-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="text-white font-bold text-lg leading-none">Depa 804</p>
                <p className="text-blue-300 text-xs">Panel Admin</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-blue-300 hover:text-white p-1 rounded-lg hover:bg-blue-800 transition"
            >
              <X size={20} />
            </button>
          </div>
          <NavLinks onClick={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}
