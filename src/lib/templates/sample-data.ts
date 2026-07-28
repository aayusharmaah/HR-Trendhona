import { DocumentTypeDefinition } from "@/types/document";
import { todayISODate } from "@/lib/format";

export function buildSampleData(doc: DocumentTypeDefinition): Record<string, string> {
  const data: Record<string, string> = {};
  const today = todayISODate();

  for (const field of doc.fields) {
    if (field.placeholder) {
      data[field.key] = field.placeholder;
      continue;
    }
    switch (field.type) {
      case "date":
        data[field.key] = today;
        break;
      case "select":
        data[field.key] = field.options?.[0]?.value ?? "";
        break;
      case "number":
        data[field.key] = "50000";
        break;
      default:
        data[field.key] = `Sample ${field.label}`;
    }
  }

  return data;
}
