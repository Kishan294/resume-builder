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
import { Loader2, User, Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const result = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (result.error) {
        // Handle specific Better Auth errors
        const errorMessage = result.error.message || "Registration failed";
        toast.error(errorMessage);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      // Handle different types of errors
      let errorMessage = "Failed to create account. Please try again.";

      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = (error as { message: string }).message;
        if (errorMsg.includes("Password is too short")) {
          errorMessage = "Password must be at least 6 characters long";
          // Set form error for password field
          form.setError("password", {
            type: "manual",
            message: "Password must be at least 6 characters long"
          });
        } else if (errorMsg.includes("User already exists") || errorMsg.includes("Email already")) {
          errorMessage = "An account with this email already exists";
          // Set form error for email field
          form.setError("email", {
            type: "manual",
            message: "An account with this email already exists"
          });
        } else if (errorMsg.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address";
          form.setError("email", {
            type: "manual",
            message: "Please enter a valid email address"
          });
        } else if (errorMsg.includes("Name is required")) {
          errorMessage = "Full name is required";
          form.setError("name", {
            type: "manual",
            message: "Full name is required"
          });
        } else if (errorMsg.includes("Too many requests")) {
          errorMessage = "Too many registration attempts. Please try again later.";
        } else if (errorMsg.includes("Network")) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = errorMsg;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signIn.social({
        provider: "google",
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to sign up with Google");
        return;
      }

      toast.success("Welcome!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Google sign up failed:", error);

      let errorMessage = "Failed to sign up with Google";
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = (error as { message: string }).message;
        if (errorMsg.includes("popup_closed")) {
          errorMessage = "Sign-up was cancelled";
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
          <User className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          Sign up to start building your professional resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="h-4 w-4" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
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
                        placeholder="Create a password"
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Lock className="h-4 w-4" />
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 pr-10 h-12 border-gray-200 focus:border-orange-500"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
          onClick={handleGoogleSignUp}
          disabled={form.formState.isSubmitting || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Signing up...
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
