"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { RotateCcw, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { DocumentTypeDefinition } from "@/types/document";
import { CompanySettings } from "@/types/company";
import { buildVariableMap, renderTemplate } from "@/lib/templates/render";
import { buildSampleData } from "@/lib/templates/sample-data";
import { EditorToolbar } from "@/components/templates/editor-toolbar";
import { LivePreview } from "@/components/generator/live-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CURRENCY_KEYS = new Set(["stipend", "ctc", "salary", "bonus"]);
const COMPANY_VARIABLES = [
  { label: "Company Name", value: "company_name" },
  { label: "Office Address", value: "office_address" },
  { label: "Company Email", value: "company_email" },
  { label: "Website", value: "website" },
  { label: "GST Number", value: "gst" },
  { label: "HR Name", value: "hr_name" },
  { label: "CEO Name", value: "ceo_name" },
  { label: "Authorized Signatory", value: "authorized_signatory" },
  { label: "Today's Date", value: "today_formatted" },
];

export function TemplateEditor({
  doc,
  initialHtml,
  isCustom,
  company,
  onSave,
  onReset,
}: {
  doc: DocumentTypeDefinition;
  initialHtml: string;
  isCustom: boolean;
  company: CompanySettings;
  onSave: (html: string) => void;
  onReset: () => void;
}) {
  const [showPreview, setShowPreview] = React.useState(true);
  const [dirtyHtml, setDirtyHtml] = React.useState(initialHtml);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialHtml,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setDirtyHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "preview-content min-h-[420px] px-4 py-4 focus:outline-none text-[13.5px]",
      },
    },
  });

  React.useEffect(() => {
    if (editor && editor.getHTML() !== initialHtml) {
      editor.commands.setContent(initialHtml);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDirtyHtml(initialHtml);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id]);

  const variableOptions = React.useMemo(() => {
    const fieldVars = doc.fields.flatMap((f) => {
      const opts = [{ label: f.label, value: f.key }];
      if (f.type === "date") opts.push({ label: `${f.label} (formatted)`, value: `${f.key}_formatted` });
      if (f.type === "number" && CURRENCY_KEYS.has(f.key)) {
        opts.push({ label: `${f.label} (formatted)`, value: `${f.key}_formatted` });
        opts.push({ label: `${f.label} (in words)`, value: `${f.key}_words` });
      }
      return opts;
    });
    return [...fieldVars, ...COMPANY_VARIABLES];
  }, [doc]);

  const sampleVars = React.useMemo(
    () => buildVariableMap(doc, buildSampleData(doc), company),
    [doc, company]
  );
  const previewHtml = renderTemplate(dirtyHtml, sampleVars);

  function handleSave() {
    if (!editor) return;
    onSave(editor.getHTML());
    toast.success("Template saved");
  }

  function handleReset() {
    onReset();
    editor?.commands.setContent(doc.defaultTemplate);
    setDirtyHtml(doc.defaultTemplate);
    toast("Reset to default template");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold">{doc.name}</p>
          <p className="text-xs text-muted-foreground">
            {isCustom ? "Custom wording in use" : "Using default wording"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview((s) => !s)}>
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Hide preview" : "Show preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} disabled={!isCustom}>
            <RotateCcw className="h-4 w-4" />
            Reset to default
          </Button>
          <Button variant="brand" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save template
          </Button>
        </div>
      </div>

      <div className={showPreview ? "grid grid-cols-1 gap-6 lg:grid-cols-2" : "grid grid-cols-1"}>
        <Card className="overflow-hidden p-0">
          {editor && <EditorToolbar editor={editor} variableOptions={variableOptions} />}
          <div className="rounded-b-lg border border-t-0 border-border">
            <EditorContent editor={editor} />
          </div>
        </Card>

        {showPreview && (
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Preview with sample data
            </p>
            <LivePreview documentName={doc.name} bodyHtml={previewHtml} company={company} />
          </div>
        )}
      </div>
    </div>
  );
}
