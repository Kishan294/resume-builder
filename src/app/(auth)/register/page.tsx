"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { AuthShell } from "@/components/common/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      heading="Create your account"
      subheading="Start building your professional resume today"
      leftPanelTitle="Start building with ProfilCraft"
      leftPanelDescription="Create your account and start building a professional resume that stands out to recruiters and hiring managers."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
