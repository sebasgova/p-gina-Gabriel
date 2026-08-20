import { redirect } from "next/navigation";
import { getIsAuthenticated } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await getIsAuthenticated();
  if (!authenticated) redirect("/admin/login");

  return <AdminShell>{children}</AdminShell>;
}
