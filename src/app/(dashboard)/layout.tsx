import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-slate-50/50">
        <DashboardHeader />
        <div className="relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4"></div>
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
