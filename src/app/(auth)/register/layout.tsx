import { AuthGuard } from "@/components/auth/auth-guard";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  );
}
