"use client";

import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
  leftPanelTitle: string;
  leftPanelDescription: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
}

export function AuthShell({
  children,
  heading,
  subheading,
  leftPanelTitle,
  leftPanelDescription,
  footerText,
  footerLinkText,
  footerHref,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/15 rounded-full blur-[80px]" />

        <div className="relative text-center max-w-md">
          <div className="inline-flex p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
            <FileText className="h-10 w-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {leftPanelTitle}
          </h2>
          <p className="text-slate-400 leading-relaxed">
            {leftPanelDescription}
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </Link>
          </div>

          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Profil<span className="text-indigo-600">Craft</span>
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-left mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {heading}
              </h1>
              <p className="text-slate-500 text-sm">
                {subheading}
              </p>
            </div>

            {children}

            <div className="text-center mt-6">
              <p className="text-slate-500 text-sm">
                {footerText}{" "}
                <Link
                  href={footerHref}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
