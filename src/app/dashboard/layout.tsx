import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DashboardHeader />
        {children}
      </div>
    </AuthGuard>
  );
}