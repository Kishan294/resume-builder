"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Chrome, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
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
              <Chrome className="h-5 w-5 mr-2 text-orange-500" />
              Continue with Google
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
