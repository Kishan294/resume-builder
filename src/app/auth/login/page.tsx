import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { FileText } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">Resume Builder</span>
          </Link>
        </div>

        <LoginForm />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}