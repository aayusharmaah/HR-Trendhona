"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, Pencil } from "lucide-react";

import { ALL_DOCUMENT_TYPES } from "@/lib/templates/registry";
import { getDocIcon } from "@/lib/icon-map";
import { getStoredTemplates } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TemplateList() {
  const [customIds, setCustomIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomIds(new Set(Object.keys(getStoredTemplates())));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ALL_DOCUMENT_TYPES.map((doc) => {
        const Icon = getDocIcon(doc.icon);
        const isCustom = customIds.has(doc.id);
        return (
          <Card key={doc.id} className={!doc.available ? "opacity-60" : undefined}>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/10 text-brand-purple">
                  <Icon className="h-5 w-5" />
                </div>
                {doc.available ? (
                  <Badge variant={isCustom ? "brand" : "outline"}>{isCustom ? "Custom" : "Default"}</Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" /> Coming soon
                  </Badge>
                )}
              </div>
              <div>
                <p className="font-display font-semibold">{doc.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
              </div>
              <Button variant="outline" size="sm" className="w-fit" disabled={!doc.available} asChild={doc.available}>
                {doc.available ? (
                  <Link href={`/templates/${doc.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit template
                  </Link>
                ) : (
                  <span>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit template
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
