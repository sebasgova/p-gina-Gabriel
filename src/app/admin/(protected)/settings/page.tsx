import { getSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Ajustes del sitio</h1>
      <p className="mt-1 text-sm text-mist">
        Textos principales, showreel, software y datos de contacto.
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
