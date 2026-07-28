import { TemplateList } from "@/components/templates/template-list";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Templates</h1>
        <p className="text-sm text-muted-foreground">
          Edit the wording of any document. Variables like{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-xs">{"{{candidate_name}}"}</code> are
          replaced automatically when a document is generated.
        </p>
      </div>
      <TemplateList />
    </div>
  );
}
