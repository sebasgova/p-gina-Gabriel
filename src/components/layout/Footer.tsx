import { Container } from "@/components/ui/Container";
import { getIcon } from "@/lib/icons";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Settings } from "@/lib/types";

const MailIcon = getIcon("Mail");
const WhatsAppIcon = getIcon("WhatsApp");

export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line pt-16 pb-8">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-display text-2xl font-semibold tracking-tight">
              Gabriel Mendoza<span className="text-accent">.</span>
            </span>
            <p className="mt-3 max-w-sm text-sm text-mist">
              Video Editor &amp; Motion Designer. Historias con precisión cinematográfica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {settings.socials.map((social) => {
              const Icon = getIcon(social.icon);
              return (
                <MagneticButton key={social.label} strength={0.5}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-mist transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_24px_rgba(255,106,0,0.35)]"
                  >
                    <Icon size={18} />
                  </a>
                </MagneticButton>
              );
            })}
            <MagneticButton strength={0.5}>
              <a
                href={`mailto:${settings.contactEmail}`}
                aria-label="Correo"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-mist transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_24px_rgba(255,106,0,0.35)]"
              >
                <MailIcon size={18} />
              </a>
            </MagneticButton>
            <MagneticButton strength={0.5}>
              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-mist transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_24px_rgba(255,106,0,0.35)]"
              >
                <WhatsAppIcon size={18} />
              </a>
            </MagneticButton>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-mist-dim md:flex-row md:items-center md:justify-between">
          <span>© {year} — Todos los derechos reservados.</span>
          <span>Diseñado y desarrollado con precisión cinematográfica.</span>
        </div>
      </Container>
    </footer>
  );
}
