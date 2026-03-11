"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Zap,
  Shield,
  ArrowRight,
  Layers,
  Palette,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-violet-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-32 pb-24 sm:pb-36">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-sm font-medium text-indigo-700">
                Professional Resume Builder
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold text-slate-950 mb-6 leading-[1.05] tracking-tight">
              Build resumes that
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient">
                land interviews.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed font-medium">
              Create ATS-optimized, beautifully crafted resumes in minutes. 
              Choose from professional templates and export pixel-perfect PDFs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {session ? (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 rounded-2xl font-bold gap-2 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <FileText className="h-5 w-5" />
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 rounded-2xl font-bold gap-2 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Start Building Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 text-base border-slate-200 hover:bg-slate-50 rounded-2xl font-bold text-slate-700 hover:border-slate-300 transition-all duration-200"
                    >
                      View Templates
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-14 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">ATS Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">PDF Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-slate-50/50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Everything you need to stand out
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-white rounded-2xl border border-slate-100 p-8 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-indigo-200/50 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Lightning Fast Editor
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Smart sections and intuitive controls — your resume is ready in
                minutes, not hours.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white rounded-2xl border border-slate-100 p-8 hover:border-violet-100 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-violet-200/50 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                ATS-Ready Templates
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Every template is tested against modern applicant tracking
                systems to keep you on the shortlist.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white rounded-2xl border border-slate-100 p-8 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-blue-200/50 group-hover:scale-110 transition-transform">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Pixel Perfect PDF
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                High-definition exports that look consistent across every device
                and printer.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-white rounded-2xl border border-slate-100 p-8 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-emerald-200/50 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                8+ Pro Templates
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                From Modern Pro to Executive Elite — choose a style that matches
                your industry and seniority.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-white rounded-2xl border border-slate-100 p-8 hover:border-amber-100 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white mb-5 shadow-lg shadow-amber-200/50 group-hover:scale-110 transition-transform">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Full Customization
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Add skills, projects, work history with rich text — each section
                is fully customizable.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-white rounded-2xl border border-slate-100 p-8 hover:border-rose-100 hover:shadow-lg hover:shadow-rose-50 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-200/50 group-hover:scale-110 transition-transform">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Share Anywhere
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                Generate a public link to share your resume instantly with
                recruiters and hiring managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-12 sm:p-20 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-violet-500/5 rounded-full" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Ready to land your
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  dream role?
                </span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
                Create a professional resume that gets past ATS filters and
                impresses hiring managers. It only takes a few minutes.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-10 text-base bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-bold shadow-2xl shadow-black/20 gap-2 transition-all hover:-translate-y-0.5"
                >
                  Start Building Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
