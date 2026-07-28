import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "purple",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "purple" | "pink" | "cyan";
}) {
  const accentBg =
    accent === "pink"
      ? "bg-brand-pink/10 text-brand-pink"
      : accent === "cyan"
      ? "bg-brand-cyan/10 text-brand-cyan"
      : "bg-brand-purple/10 text-brand-purple";

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold">{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", accentBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
