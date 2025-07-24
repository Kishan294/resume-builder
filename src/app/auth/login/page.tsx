import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { AuthGuard } from "@/components/auth/auth-guard";
import { FileText } from "lucide-react";

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
              <FileText className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-gray-900">Resume Builder</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Build professional resumes that get you hired
            </p>
          </div>

          <LoginForm />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}