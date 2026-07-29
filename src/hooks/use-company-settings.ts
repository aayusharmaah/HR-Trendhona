"use client";

import { useCallback, useEffect, useState } from "react";
import { CompanySettings, DEFAULT_COMPANY_SETTINGS } from "@/types/company";
import { getCompanySettings, saveCompanySettings } from "@/lib/storage";

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR, so we hydrate once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(getCompanySettings());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<CompanySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveCompanySettings(next);
      return next;
    });
  }, []);

  const replace = useCallback((next: CompanySettings) => {
    saveCompanySettings(next);
    setSettings(next);
  }, []);

  return { settings, update, replace, hydrated };
}
