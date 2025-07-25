"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    try {
      const result = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        // Handle specific Better Auth errors
        const errorMessage = result.error.message || "Login failed";
        toast.error(errorMessage);
        return;
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);

      // Handle different types of errors
      let errorMessage = "Login failed. Please try again.";

      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = (error as { message: string }).message;
        if (errorMsg.includes("Invalid credentials") || errorMsg.includes("User not found")) {
          errorMessage = "Invalid email or password";
        } else if (errorMsg.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please try again later.";
        } else if (errorMsg.includes("Network")) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = errorMsg;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signIn.social({
        provider: "google",
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to sign in with Google");
        return;
      }

      toast.success("Welcome!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Google sign in failed:", error);

      let errorMessage = "Failed to sign in with Google";
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = (error as { message: string }).message;
        if (errorMsg.includes("popup_closed")) {
          errorMessage = "Sign-in was cancelled";
        } else if (errorMsg.includes("access_denied")) {
          errorMessage = "Access denied. Please try again.";
        } else {
          errorMessage = errorMsg;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          Sign in to your account to continue building amazing resumes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Mail className="h-4 w-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 h-12 border-gray-200 focus:border-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Lock className="h-4 w-4" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 pr-10 h-12 border-gray-200 focus:border-orange-500"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold"
              disabled={form.formState.isSubmitting || isGoogleLoading}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
          onClick={handleGoogleSignIn}
          disabled={form.formState.isSubmitting || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
