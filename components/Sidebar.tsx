"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { LayoutDashboard, Users, Layers, BarChart2, LogOut } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/grupos", label: "Grupos", icon: Layers },
  { href: "/usuarios", label: "Usuarios", icon: Users },
  { href: "/progreso", label: "Progreso", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  return (
    <aside className="w-64 min-h-screen bg-blue-900 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <p className="text-white font-bold text-lg leading-none">Depa 804</p>
            <p className="text-blue-300 text-xs">Panel Admin</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition",
                active
                  ? "bg-white text-blue-900"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      {/* Logout */}
      <div className="px-3 py-4 border-t border-blue-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
