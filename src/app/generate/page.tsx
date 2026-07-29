import { GeneratorFlow } from "@/components/generator/generator-flow";

export default function GeneratePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Generate Documents</h1>
        <p className="text-sm text-muted-foreground">
          Choose a document, fill in the details, and export a ready-to-send PDF.
        </p>
      </div>
      <GeneratorFlow />
    </div>
  );
}
