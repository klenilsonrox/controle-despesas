import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

export default async function PrivateLayout({ children }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <AuthProvider initialUser={user}>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
