import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/lib/providers/trpc-provider";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ProfilCraft - Professional Resume Builder",
    template: "%s | ProfilCraft",
  },
  description:
    "Create professional resumes with ease using our modern resume builder. Choose from multiple templates, export to PDF, and share your resume online.",
  keywords: [
    "resume builder",
    "CV maker",
    "professional resume",
    "job application",
    "career",
  ],
  authors: [{ name: "ProfilCraft Team" }],
  creator: "ProfilCraft",
  publisher: "ProfilCraft",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    title: "ProfilCraft - Professional Resume Builder",
    description:
      "Create professional resumes with ease using our modern resume builder.",
    siteName: "ProfilCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProfilCraft - Professional Resume Builder",
    description:
      "Create professional resumes with ease using our modern resume builder.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <TRPCProvider>
            {children}
            <Toaster />
            <Analytics />
          </TRPCProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
