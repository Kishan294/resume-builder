"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, User, Settings, LogOut, Star } from "lucide-react";
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
    <header className="border-b border-gray-200/50 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex items-center space-x-3 group"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-105 transition-transform">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ProfilCraft
            </h1>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isPending ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <UserMenu user={session.user} onSignOut={handleSignOut} />
            ) : variant === "landing" ? (
              <GuestActions />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  user,
  onSignOut
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
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback>
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
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
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GuestActions() {
  return (
    <>
      <Badge variant="secondary" className="hidden md:flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border-orange-200">
        <Star className="h-3 w-3" />
        Free Forever
      </Badge>
      <Link href="/login">
        <Button
          variant="outline"
          className="hidden sm:flex hover:bg-orange-500 hover:text-white transition-all duration-300 border-gray-200 hover:border-orange-500"
          size="sm"
        >
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base px-3 sm:px-4"
          size="sm"
        >
          <span className="hidden sm:inline">Get Started Free</span>
          <span className="sm:hidden">Sign Up</span>
        </Button>
      </Link>
    </>
  );
}
