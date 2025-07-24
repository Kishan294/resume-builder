"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Users, Download, Share2, Zap, Shield, Clock, Star, User, Settings, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
            <FileText className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          </Link>
          <div className="flex items-center space-x-4">
            {isPending ? (
              // Loading state
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              // Authenticated user menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && <p className="font-medium">{session.user.name}</p>}
                      {session.user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Unauthenticated user buttons
              <>
                <Badge variant="secondary" className="hidden sm:flex">
                  <Star className="h-3 w-3 mr-1" />
                  Free Forever
                </Badge>
                <Link href="/auth/login">
                  <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="shadow-md hover:shadow-lg transition-shadow">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl transform -rotate-12 scale-150"></div>
        <div className="container mx-auto text-center relative">
          <Badge variant="outline" className="mb-6 px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            Build Professional Resumes in Minutes
          </Badge>
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Your Perfect
            <span className="text-primary block">Resume</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Create professional, ATS-friendly resumes with our intuitive builder.
            Choose from beautiful templates, customize with ease, and export to PDF in minutes.
            <span className="font-semibold text-primary"> No design skills required.</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <FileText className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="lg" className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <FileText className="h-5 w-5 mr-2" />
                    Start Building Free
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                    View Templates
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Ready in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>10,000+ users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h3 className="text-4xl font-bold mb-4">Why Choose Our Resume Builder?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create a professional resume that gets you hired
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-8 w-8 text-primary" />
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
                <div className="mx-auto mb-4 p-3 bg-green-500/10 rounded-full w-fit group-hover:bg-green-500/20 transition-colors">
                  <Shield className="h-8 w-8 text-green-500" />
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
                <div className="mx-auto mb-4 p-3 bg-blue-500/10 rounded-full w-fit group-hover:bg-blue-500/20 transition-colors">
                  <Download className="h-8 w-8 text-blue-500" />
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
                <div className="mx-auto mb-4 p-3 bg-purple-500/10 rounded-full w-fit group-hover:bg-purple-500/20 transition-colors">
                  <Share2 className="h-8 w-8 text-purple-500" />
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
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative">
          <h3 className="text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h3>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of job seekers who have successfully created their resumes with us.
            Start building your professional resume today - it's completely free!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <FileText className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <FileText className="h-5 w-5 mr-2" />
                    Create Your Resume Now
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary transition-colors">
                    Sign In to Continue
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Resume Builder</span>
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              Build professional resumes that get you hired. Free, fast, and ATS-optimized.
            </p>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Resume Builder. All rights reserved. Made with ❤️ for job seekers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
