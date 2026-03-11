"use client";

import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/common/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      heading="Welcome back"
      subheading="Sign in to your account to continue building"
      leftPanelTitle="Welcome back to ProfilCraft"
      leftPanelDescription="Continue building your professional resume. Your career narrative is waiting for you."
      footerText="Don't have an account?"
      footerLinkText="Sign up free"
      footerHref="/register"
    >
      <LoginForm />
    </AuthShell>
  );
}
