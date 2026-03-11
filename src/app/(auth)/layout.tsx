import { AuthGuard } from "@/components/auth/auth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      {children}
    </AuthGuard>
  );
}
