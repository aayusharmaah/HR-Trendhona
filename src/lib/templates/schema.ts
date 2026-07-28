import { z } from "zod";
import { FieldConfig } from "@/types/document";
import { isValidEmail, isValidIndianPhone } from "@/lib/format";

export function buildZodSchema(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny = z.string();

    if (field.type === "email") {
      schema = z.string().refine((v) => v.length === 0 || isValidEmail(v), {
        message: "Enter a valid email address",
      });
    } else if (field.type === "tel") {
      schema = z.string().refine((v) => v.length === 0 || isValidIndianPhone(v), {
        message: "Enter a valid 10-digit phone number",
      });
    } else if (field.type === "number") {
      schema = z.string().refine((v) => v.length === 0 || /^\d+(\.\d+)?$/.test(v), {
        message: "Numbers only",
      });
    }

    if (field.required) {
      schema = schema.refine((v) => typeof v === "string" && v.trim().length > 0, {
        message: `${field.label} is required`,
      });
    } else {
      schema = schema.optional().default("");
    }

    shape[field.key] = schema;
  }

  return z.object(shape);
}

export type SmartFormValues = Record<string, string>;
