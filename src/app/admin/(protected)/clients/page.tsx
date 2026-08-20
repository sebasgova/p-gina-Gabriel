import { getAllClients } from "@/lib/data/clients";
import { ClientCard } from "@/components/admin/ClientCard";

export default async function ClientsPage() {
  const clients = await getAllClients();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Clientes</h1>
      <p className="mt-1 text-sm text-mist">
        Creadores y marcas con los que has trabajado — aparecen en la franja de la página principal.
      </p>

      <div className="mt-8 space-y-4">
        {clients.map((c) => (
          <ClientCard key={c.id} client={c} />
        ))}
      </div>

      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-sm font-medium text-mist">Agregar nuevo cliente</h2>
        <div className="mt-4">
          <ClientCard key={`new-${clients.length}`} />
        </div>
      </div>
    </div>
  );
}
