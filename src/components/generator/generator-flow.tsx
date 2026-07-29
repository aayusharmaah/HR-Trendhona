"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { DocumentTypeId } from "@/types/document";
import { useCompanySettings } from "@/hooks/use-company-settings";
import { useTemplate } from "@/hooks/use-template";
import { useDocuments } from "@/hooks/use-documents";
import { buildVariableMap, renderTemplate } from "@/lib/templates/render";
import { generateDocumentPdf, downloadPdfBytes } from "@/lib/pdf/generate-pdf";
import { slugifyFileName } from "@/lib/format";

import { DocumentTypeGrid } from "@/components/generator/document-type-grid";
import { SmartForm, SmartFormHandle } from "@/components/generator/smart-form";
import { LivePreview } from "@/components/generator/live-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function GeneratorFlow() {
  const [selected, setSelected] = React.useState<DocumentTypeId | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});
  const [generating, setGenerating] = React.useState(false);
  const formRef = React.useRef<SmartFormHandle>(null);

  const { settings: company, hydrated: companyHydrated } = useCompanySettings();
  const { definition, html: templateHtml } = useTemplate(selected ?? ("internship-offer" as DocumentTypeId));
  const { record } = useDocuments();

  if (!selected || !definition) {
    return <DocumentTypeGrid onSelect={setSelected} />;
  }

  const vars = buildVariableMap(definition, formValues, company);
  const renderedBody = renderTemplate(templateHtml, vars);

  async function handleValidSubmit(values: Record<string, string>) {
    if (!definition) return;
    setGenerating(true);
    try {
      const mergedVars = buildVariableMap(definition, values, company);
      const bodyHtml = renderTemplate(templateHtml, mergedVars);
      const bytes = await generateDocumentPdf({
        documentName: definition.name,
        candidateName: values.candidate_name || "Candidate",
        bodyHtml,
        company,
      });
      const fileName = slugifyFileName(`${definition.shortName} - ${values.candidate_name || "Candidate"}.pdf`);
      downloadPdfBytes(bytes, fileName);

      record({
        id: uuidv4(),
        documentType: definition.id,
        documentTypeName: definition.name,
        candidateName: values.candidate_name || "",
        email: values.email || "",
        designation: values.designation || "",
        generatedAt: new Date().toISOString(),
        fileName,
        data: values,
      });

      toast.success("PDF generated", { description: fileName });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong generating the PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setSelected(null)} className="-ml-2">
          <ArrowLeft className="h-4 w-4" />
          Choose a different document
        </Button>
        <Button
          variant="brand"
          size="lg"
          disabled={generating || !companyHydrated}
          onClick={() => formRef.current?.submit()}
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Generate PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-4 font-display text-lg font-semibold">{definition.name}</p>
          <SmartForm
            ref={formRef}
            doc={definition}
            onChange={setFormValues}
            onValidSubmit={handleValidSubmit}
          />
        </Card>

        <div className="lg:sticky lg:top-20 lg:h-fit">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Live Preview
          </p>
          <LivePreview documentName={definition.name} bodyHtml={renderedBody} company={company} />
        </div>
      </div>
    </div>
  );
}
