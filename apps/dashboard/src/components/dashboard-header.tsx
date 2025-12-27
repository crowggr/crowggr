"use client";

import { CaretDown, SignOut } from "@phosphor-icons/react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="flex h-[41px] items-center gap-4 border-sidebar-border border-b px-4">
      <SidebarTrigger />
      <div className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button className="gap-2" variant="ghost">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:inline">{user.name}</span>
              <CaretDown className="size-4 opacity-60" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" sideOffset={12}>
          <DropdownMenuItem
            onClick={async () => {
              await import("@/lib/auth-client").then((m) =>
                m.authClient.signOut()
              );
              window.location.href = "/login";
            }}
          >
            <SignOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ThemeToggle />
    </header>
  );
}
