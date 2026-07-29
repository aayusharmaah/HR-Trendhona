"use client";

import { useCompanySettings } from "@/hooks/use-company-settings";
import { CompanySettingsForm } from "@/components/settings/company-settings-form";

export default function SettingsPage() {
  const { settings, replace, hydrated } = useCompanySettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Company Settings</h1>
        <p className="text-sm text-muted-foreground">
          Stored locally in your browser. These values automatically populate every document.
        </p>
      </div>
      {hydrated && <CompanySettingsForm initial={settings} onSave={replace} />}
    </div>
  );
}
