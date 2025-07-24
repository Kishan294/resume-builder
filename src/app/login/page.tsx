"use client";

import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            </div>
          </div>

          <div className="space-y-6">
            <LoginForm />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}