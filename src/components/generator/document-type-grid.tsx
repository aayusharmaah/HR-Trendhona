"use client";

import { Lock } from "lucide-react";

import { ALL_DOCUMENT_TYPES } from "@/lib/templates/registry";
import { getDocIcon } from "@/lib/icon-map";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DocumentTypeId } from "@/types/document";

export function DocumentTypeGrid({ onSelect }: { onSelect: (id: DocumentTypeId) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ALL_DOCUMENT_TYPES.map((doc) => {
        const Icon = getDocIcon(doc.icon);
        return (
          <Card
            key={doc.id}
            className={cn(
              "group transition-all",
              doc.available
                ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
                : "cursor-not-allowed opacity-60"
            )}
            onClick={() => doc.available && onSelect(doc.id)}
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/10 text-brand-purple">
                  <Icon className="h-5 w-5" />
                </div>
                {!doc.available && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" /> Coming soon
                  </Badge>
                )}
              </div>
              <div>
                <p className="font-display font-semibold">{doc.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
              </div>
              <Badge variant="brand" className="w-fit">
                {doc.category}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
