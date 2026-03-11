"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormErrorBoundary } from "@/components/error/form-error-boundary";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";
import { registerSchema, type RegisterFormData } from "@/lib/validations";

function RegisterFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      const result = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (result.error) {
        const errorMessage = result.error.message || "Registration failed";
        toast.error(errorMessage);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      let errorMessage = "Failed to create account. Please try again.";

      if (error && typeof error === "object" && "message" in error) {
        const errorMsg = (error as { message: string }).message;
        if (errorMsg.includes("Password is too short")) {
          errorMessage = "Password must be at least 6 characters long";
          form.setError("password", {
            type: "manual",
            message: "Password must be at least 6 characters long",
          });
        } else if (
          errorMsg.includes("User already exists") ||
          errorMsg.includes("Email already")
        ) {
          errorMessage = "An account with this email already exists";
          form.setError("email", {
            type: "manual",
            message: "An account with this email already exists",
          });
        } else if (errorMsg.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address";
          form.setError("email", {
            type: "manual",
            message: "Please enter a valid email address",
          });
        } else if (errorMsg.includes("Name is required")) {
          errorMessage = "Full name is required";
          form.setError("name", {
            type: "manual",
            message: "Full name is required",
          });
        } else if (errorMsg.includes("Too many requests")) {
          errorMessage =
            "Too many registration attempts. Please try again later.";
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
      if (error && typeof error === "object" && "message" in error) {
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create your account
        </h1>
        <p className="text-slate-500 text-sm">
          Start building your professional resume today
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium text-sm">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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
                <FormLabel className="text-slate-700 font-medium text-sm">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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
                <FormLabel className="text-slate-700 font-medium text-sm">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pr-10 transition-all"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
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
                <FormLabel className="text-slate-700 font-medium text-sm">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pr-10 transition-all"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 rounded-xl font-semibold transition-all duration-200"
            disabled={form.formState.isSubmitting || isGoogleLoading}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200"
        onClick={handleGoogleSignUp}
        disabled={form.formState.isSubmitting || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Signing up...
          </>
        ) : (
          <>
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>
    </div>
  );
}

export function RegisterForm() {
  return (
    <FormErrorBoundary>
      <RegisterFormContent />
    </FormErrorBoundary>
  );
}
