"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ValidatedInput } from "@/components/ui/validated-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PersonalInfo } from "@/types/resume";
import { User, Mail, Phone, MapPin, Globe } from "lucide-react";
import { personalInfoSchema, type PersonalInfoData } from "@/lib/validations";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface PersonalInfoEditorProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
}

export function PersonalInfoEditor({ data, onUpdate }: PersonalInfoEditorProps) {
  const form = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      website: data.website || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      summary: data.summary || "",
    },
  });

  // Update form when data changes
  useEffect(() => {
    form.reset({
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      website: data.website || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      summary: data.summary || "",
    });
  }, [data, form]);

  // Watch form changes and update parent
  useEffect(() => {
    const subscription = form.watch(async (values) => {
      // Trigger validation
      await form.trigger();
      onUpdate(values as PersonalInfo);
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">Personal Information</CardTitle>
        <CardDescription className="text-gray-600">
          Add your basic contact information and professional summary
          {Object.keys(form.formState.errors).length > 0 && (
            <span className="block text-red-500 text-sm mt-1">
              Please fix {Object.keys(form.formState.errors).length} validation error(s) below
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="h-4 w-4" />
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <ValidatedInput
                      fieldPath="personal.fullName"
                      placeholder="John Doe"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 h-11 border-gray-200 focus:border-orange-500"
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
                    Email *
                  </FormLabel>
                  <FormControl>
                    <ValidatedInput
                      fieldPath="personal.email"
                      type="email"
                      placeholder="john@example.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 h-11 border-gray-200 focus:border-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Phone className="h-4 w-4" />
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 h-11 border-gray-200 focus:border-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <MapPin className="h-4 w-4" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New York, NY"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 h-11 border-gray-200 focus:border-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Globe className="h-4 w-4" />
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://johndoe.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 h-11 border-gray-200 focus:border-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/johndoe"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 h-11 border-gray-200 focus:border-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/johndoe"
                      className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 h-11 border-gray-200 focus:border-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Professional Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a brief professional summary highlighting your key skills and experience..."
                    rows={4}
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 resize-none border-gray-200 focus:border-orange-500"
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Brief summary of your professional background and key achievements</span>
                  <span>{field.value?.length || 0}/500</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </CardContent>
    </Card>
  );
}
