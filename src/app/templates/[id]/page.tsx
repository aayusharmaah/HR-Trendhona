"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { DocumentTypeId } from "@/types/document";
import { useTemplate } from "@/hooks/use-template";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { TemplateEditor } from "@/components/templates/template-editor";
import { Button } from "@/components/ui/button";

export default function TemplateEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id as DocumentTypeId;

  const { definition, html, isCustom, hydrated, save, resetToDefault } = useTemplate(id);
  const { settings: company } = useCompanySettings();

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="-ml-2" asChild>
        <Link href="/templates">
          <ArrowLeft className="h-4 w-4" />
          Back to templates
        </Link>
      </Button>

      {!definition || !definition.available ? (
        <p className="text-sm text-muted-foreground">
          This document type isn&apos;t available in this build yet.
        </p>
      ) : !hydrated ? (
        <p className="text-sm text-muted-foreground">Loading template…</p>
      ) : (
        <TemplateEditor
          doc={definition}
          initialHtml={html}
          isCustom={isCustom}
          company={company}
          onSave={save}
          onReset={resetToDefault}
        />
      )}
    </div>
  );
}
