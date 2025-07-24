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
    <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href={session ? "/dashboard" : "/"}
          className="flex items-center space-x-2 group"
        >
          <FileText className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
        </Link>

        <div className="flex items-center space-x-4">
          {isPending ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          ) : session ? (
            <UserMenu user={session.user} onSignOut={handleSignOut} />
          ) : variant === "landing" ? (
            <GuestActions />
          ) : null}
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
      <Badge variant="secondary" className="hidden sm:flex">
        <Star className="h-3 w-3 mr-1" />
        Free Forever
      </Badge>
      <Link href="/login">
        <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button className="shadow-md hover:shadow-lg transition-shadow">
          Get Started Free
        </Button>
      </Link>
    </>
  );
}