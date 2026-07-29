"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";

import { DocumentTypeDefinition } from "@/types/document";
import { buildZodSchema } from "@/lib/templates/schema";
import {
  autoCapitalizeName,
  calculateDuration,
  calculateProbationEndDate,
  generateEmployeeId,
  todayISODate,
} from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function buildDefaultValues(doc: DocumentTypeDefinition): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of doc.fields) {
    if (field.autoFill === "currentDate") values[field.key] = todayISODate();
    else if (field.autoFill === "employeeId") values[field.key] = generateEmployeeId();
    else values[field.key] = "";
  }
  return values;
}

export interface SmartFormHandle {
  submit: () => void;
}

export const SmartForm = React.forwardRef<
  SmartFormHandle,
  {
    doc: DocumentTypeDefinition;
    onChange: (values: Record<string, string>) => void;
    onValidSubmit: (values: Record<string, string>) => void;
  }
>(function SmartForm({ doc, onChange, onValidSubmit }, ref) {
  const schema = React.useMemo(() => buildZodSchema(doc.fields), [doc]);
  const defaultValues = React.useMemo(() => buildDefaultValues(doc), [doc]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Record<string, string>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const values = watch();

  React.useEffect(() => {
    onChange(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  // Auto-calculate internship duration
  React.useEffect(() => {
    const hasDuration = doc.fields.some((f) => f.key === "internship_duration");
    if (!hasDuration) return;
    const computed = calculateDuration(values.joining_date, values.end_date);
    if (computed && computed !== values.internship_duration) {
      setValue("internship_duration", computed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.joining_date, values.end_date]);

  // Auto-calculate probation end date
  React.useEffect(() => {
    const hasField = doc.fields.some((f) => f.key === "probation_end_date");
    if (!hasField) return;
    const months = parseInt(values.probation_months || "3", 10) || 3;
    const computed = calculateProbationEndDate(values.joining_date, months);
    if (computed && computed !== values.probation_end_date) {
      setValue("probation_end_date", computed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.joining_date, values.probation_months]);

  React.useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onValidSubmit)(),
  }));

  const groups = Array.from(new Set(doc.fields.map((f) => f.group)));

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onValidSubmit)}>
      {groups.map((group) => (
        <div key={group} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {doc.fields
              .filter((f) => f.group === group)
              .map((field) => {
                const error = errors[field.key]?.message as string | undefined;
                const isAutoCalculated =
                  field.autoFill === "internshipDuration" || field.autoFill === "probationEndDate";
                const isFullWidth = field.type === "textarea";

                return (
                  <div key={field.key} className={isFullWidth ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
                    <Label htmlFor={field.key}>
                      {field.label}
                      {field.required && <span className="text-destructive"> *</span>}
                    </Label>

                    {field.type === "select" ? (
                      <Controller
                        control={control}
                        name={field.key}
                        render={({ field: rhf }) => (
                          <Select value={rhf.value} onValueChange={rhf.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={field.placeholder ?? "Select"} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    ) : field.type === "textarea" ? (
                      <Textarea
                        id={field.key}
                        placeholder={field.placeholder}
                        rows={3}
                        {...register(field.key)}
                      />
                    ) : field.autoFill === "employeeId" ? (
                      <div className="flex gap-2">
                        <Input id={field.key} {...register(field.key)} />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="Regenerate Employee ID"
                          onClick={() => setValue(field.key, generateEmployeeId())}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type === "number" ? "number" : field.type}
                        placeholder={field.placeholder}
                        readOnly={isAutoCalculated}
                        className={isAutoCalculated ? "bg-muted text-muted-foreground" : undefined}
                        {...register(field.key, {
                          onBlur: (e) => {
                            if (field.key === "candidate_name" || field.key === "reporting_manager") {
                              setValue(field.key, autoCapitalizeName(e.target.value));
                            }
                          },
                        })}
                      />
                    )}

                    {field.helpText && !error && (
                      <p className="text-xs text-muted-foreground">{field.helpText}</p>
                    )}
                    {error && <p className="text-xs text-destructive">{error}</p>}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </form>
  );
});
