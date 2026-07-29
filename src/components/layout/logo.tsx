import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--brand-purple),var(--brand-pink))] text-white">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-sm font-bold">Trendhona</p>
        <p className="text-[10px] font-medium text-muted-foreground -mt-0.5">HR Document Generator</p>
      </div>
    </div>
  );
}
