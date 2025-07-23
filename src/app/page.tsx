import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Download, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Build Your Perfect Resume
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes with our intuitive builder.
            Choose from beautiful templates and export to PDF in minutes.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8">
                Start Building Free
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="px-8">
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Our Resume Builder?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Professional Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from multiple professionally designed templates that make you stand out.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>ATS Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our resumes are optimized for Applicant Tracking Systems used by employers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Download className="h-12 w-12 text-primary mb-4" />
                <CardTitle>PDF Export</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Download your resume as a high-quality PDF ready for job applications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Share2 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate shareable links to showcase your resume online to potential employers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of job seekers who have successfully created their resumes with us.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="px-8">
              Create Your Resume Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-6 w-6" />
            <span className="text-lg font-semibold">Resume Builder</span>
          </div>
          <p className="text-gray-400">
            © 2024 Resume Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
