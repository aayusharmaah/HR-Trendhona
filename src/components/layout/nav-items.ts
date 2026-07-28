import { LayoutDashboard, Sparkles, LibraryBig, Settings2 } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate Documents", icon: Sparkles },
  { href: "/templates", label: "Templates", icon: LibraryBig },
  { href: "/settings", label: "Company Settings", icon: Settings2 },
] as const;
