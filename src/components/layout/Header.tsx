"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Showreel", href: "#showreel" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Testimonios", href: "#testimonios" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-6"
      )}
    >
      <div className="container-edge">
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500",
            scrolled ? "glass-panel" : "border border-transparent"
          )}
        >
          <a href="#hero" data-cursor="hover" className="group flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight font-display">
              Gabriel Mendoza<span className="text-accent">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor="hover"
                className="text-sm text-mist transition-colors duration-300 hover:text-paper"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticButton>
              <a
                href="#contacto"
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-black transition-colors hover:bg-accent-soft"
              >
                Trabajemos Juntos
              </a>
            </MagneticButton>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            data-cursor="hover"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="container-edge mt-2 md:hidden"
          >
            <div className="glass-panel flex flex-col gap-1 rounded-3xl p-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-paper/90 transition-colors hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-accent px-4 py-3 text-center text-sm font-medium text-black"
              >
                Trabajemos Juntos
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
