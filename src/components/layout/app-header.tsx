"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { handleLogout } from "@/lib/logout";

interface AppHeaderProps {
  variant?: "landing" | "dashboard";
}

export function AppHeader({ variant = "landing" }: AppHeaderProps) {
  const { data: session, isPending } = useSession();

  const handleSignOut = () => {
    handleLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href={session ? "/dashboard" : "/"}
              className="flex items-center gap-2.5 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all group-hover:scale-105">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Profil<span className="text-indigo-600">Craft</span>
              </span>
            </Link>

            {/* Nav Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isPending ? (
                <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" />
              ) : session ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:inline-flex text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 gap-2 font-medium rounded-xl h-9"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <UserMenu user={session.user} onSignOut={handleSignOut} />
                </div>
              ) : variant === "landing" ? (
                <GuestActions />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  user,
  onSignOut,
}: {
  user: {
    name?: string;
    email?: string;
    image?: string | null;
  };
  onSignOut: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0 ring-1 ring-slate-200/80 hover:ring-indigo-300 transition-all duration-200"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-sm font-semibold">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 p-1.5 rounded-xl shadow-xl shadow-slate-200/50 border-slate-200/80 bg-white/95 backdrop-blur-lg"
        align="end"
        sideOffset={8}
        forceMount
      >
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-indigo-50 text-indigo-700 text-sm font-semibold">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            {user.name && (
              <p className="font-semibold text-sm text-slate-900 truncate">
                {user.name}
              </p>
            )}
            {user.email && (
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="bg-slate-100" />
        <DropdownMenuItem
          asChild
          className="rounded-lg py-2 px-3 gap-2.5 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700"
        >
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-lg py-2 px-3 gap-2.5 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700">
          <User className="h-4 w-4" />
          <span className="font-medium">Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-lg py-2 px-3 gap-2.5 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700">
          <Settings className="h-4 w-4" />
          <span className="font-medium">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-100" />
        <DropdownMenuItem
          onClick={onSignOut}
          className="rounded-lg py-2 px-3 gap-2.5 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GuestActions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 font-medium rounded-xl h-9 hidden sm:inline-flex"
        >
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 rounded-xl h-9 px-4 gap-1.5 font-semibold"
        >
          <span className="hidden sm:inline">Get Started</span>
          <span className="sm:hidden">Start</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}
