"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8f8f8_1px,transparent_1px),linear-gradient(to_bottom,#f8f8f8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

      <div className="relative text-center max-w-md">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150" />
          <div className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <FileText className="h-16 w-16 text-indigo-400 mx-auto" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 gap-2 font-semibold">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="rounded-xl px-6 gap-2 font-semibold border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
