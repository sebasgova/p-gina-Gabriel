import { getIsAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const authenticated = await getIsAuthenticated();
  if (authenticated) redirect("/admin");

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white/[0.02] p-8">
        <span className="text-lg font-semibold tracking-tight">
          Gabriel Mendoza<span className="text-accent">.</span>
        </span>
        <h1 className="mt-6 text-xl font-medium">Panel de administración</h1>
        <p className="mt-1 text-sm text-mist">
          Ingresa la contraseña para gestionar el portfolio.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
