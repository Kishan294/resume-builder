"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Download, Share2, Zap, Shield, Clock } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { AppHeader } from "@/components/layout/app-header";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <AppHeader variant="landing" />

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl transform -rotate-12 scale-150"></div>
        <div className="container mx-auto text-center relative">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-xs sm:text-sm">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Build Professional Resumes in Minutes
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Your Perfect
            <span className="text-orange-500 block">Resume</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Create professional, ATS-friendly resumes with our intuitive builder.
            Choose from beautiful templates, customize with ease, and export to PDF in minutes.
            <span className="font-semibold text-orange-500"> No design skills required.</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Start Building Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg hover:bg-orange-500 hover:text-white transition-colors border-2 border-orange-200 hover:border-orange-500">
                    View Templates
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              <span>Ready in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-500" />
              <span>10,000+ users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
              Features
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why Choose Our Resume Builder?
            </h3>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Everything you need to create a professional resume that gets you hired
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-orange-500/10 rounded-full w-fit group-hover:bg-orange-500/20 transition-colors">
                  <FileText className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-xl">Professional Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Choose from multiple professionally designed templates that make you stand out from the competition.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-orange-500/10 rounded-full w-fit group-hover:bg-orange-500/20 transition-colors">
                  <Shield className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-xl">ATS Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Our resumes are optimized for Applicant Tracking Systems used by 99% of employers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-red-500/10 rounded-full w-fit group-hover:bg-red-500/20 transition-colors">
                  <Download className="h-8 w-8 text-red-500" />
                </div>
                <CardTitle className="text-xl">PDF Export</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Download your resume as a high-quality PDF ready for job applications and printing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-amber-500/10 rounded-full w-fit group-hover:bg-amber-500/20 transition-colors">
                  <Share2 className="h-8 w-8 text-amber-500" />
                </div>
                <CardTitle className="text-xl">Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Generate shareable links to showcase your resume online to potential employers instantly.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h3>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed px-4">
            Join thousands of job seekers who have successfully created their resumes with us.
            Start building your professional resume today - it&apos;s completely free!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-orange-600 hover:bg-orange-50 border-0">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Create Your Resume Now
                  </Button>
                </Link>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg text-white border-white/30 hover:bg-white/10 hover:text-white transition-colors">
                  <Link href="/login">
                    Sign In to Continue
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">Resume Builder</span>
            </div>
            <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
              Build professional resumes that get you hired. Free, fast, and ATS-optimized.
            </p>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm px-4">
              © 2024 Resume Builder. All rights reserved. Made with ❤️ for job seekers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
