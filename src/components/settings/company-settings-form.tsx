"use client";

import * as React from "react";
import { Upload, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CompanySettings } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="h-full w-full object-contain" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onChange(await fileToDataUrl(file));
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Upload
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}

export function CompanySettingsForm({
  initial,
  onSave,
}: {
  initial: CompanySettings;
  onSave: (settings: CompanySettings) => void;
}) {
  const [form, setForm] = React.useState<CompanySettings>(initial);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(initial);
  }, [initial]);

  function set<K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave(form);
    toast.success("Company settings saved");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Identity</CardTitle>
          <CardDescription>Appears on the letterhead of every generated document.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Company Name</Label>
            <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Website</Label>
            <Input value={form.website} onChange={(e) => set("website", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Office Address</Label>
            <Textarea
              rows={2}
              value={form.officeAddress}
              onChange={(e) => set("officeAddress", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Company Email</Label>
            <Input value={form.companyEmail} onChange={(e) => set("companyEmail", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>GST Number</Label>
            <Input value={form.gst} onChange={(e) => set("gst", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Default Salary Structure Notes</Label>
            <Input
              value={form.defaultSalaryStructure}
              onChange={(e) => set("defaultSalaryStructure", e.target.value)}
              placeholder="e.g. Basic 40% / HRA 20% / Special Allowance 40%"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signatories</CardTitle>
          <CardDescription>Used to sign off letters automatically.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>HR Name</Label>
            <Input value={form.hrName} onChange={(e) => set("hrName", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>CEO / Founder Name</Label>
            <Input value={form.ceoName} onChange={(e) => set("ceoName", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Authorized Signatory (for legal documents)</Label>
            <Input
              value={form.authorizedSignatory}
              onChange={(e) => set("authorizedSignatory", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding Assets</CardTitle>
          <CardDescription>Shown in the live preview and on generated PDFs.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ImageUploadField
            label="Company Logo"
            value={form.logoDataUrl}
            onChange={(v) => set("logoDataUrl", v)}
          />
          <ImageUploadField
            label="Company Stamp"
            value={form.stampDataUrl}
            onChange={(v) => set("stampDataUrl", v)}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="brand" size="lg" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
