"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, Quote, Users, Settings, LogOut, ExternalLink } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Proyectos", icon: Film },
  { href: "/admin/clients", label: "Clientes", icon: Users },
  { href: "/admin/testimonials", label: "Testimonios", icon: Quote },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line p-6 md:flex">
        <span className="text-lg font-semibold tracking-tight">
          Gabriel Mendoza<span className="text-accent">.</span>
          <span className="ml-1 text-sm font-normal text-mist">admin</span>
        </span>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                  active ? "bg-accent/10 text-accent" : "text-mist hover:bg-white/[0.04] hover:text-paper"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-mist hover:bg-white/[0.04] hover:text-paper"
        >
          <ExternalLink size={16} />
          Ver sitio
        </a>
        <button
          type="button"
          onClick={() => startTransition(() => logoutAction())}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-mist hover:bg-white/[0.04] hover:text-paper"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </aside>

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line p-3 md:hidden">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs",
                  active ? "bg-accent text-black" : "border border-line-strong text-mist"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
