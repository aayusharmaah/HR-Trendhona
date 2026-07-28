"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <div className="px-1 pb-6">
          <Logo />
        </div>
        <SidebarNav />
        <div className="mt-auto pt-4 text-[11px] text-muted-foreground px-1">
          Built for Trendhona · Local-only, no backend
        </div>
      </aside>

      {/* Mobile topbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="pb-6">
              <Logo />
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Logo />
        <ThemeToggle />
      </header>

      {/* Desktop topbar */}
      <div className="hidden lg:block lg:pl-64">
        <div className="flex h-14 items-center justify-end border-b border-border px-6">
          <ThemeToggle />
        </div>
      </div>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
