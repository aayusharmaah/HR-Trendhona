import { CompanySettings } from "@/types/company";

export function LivePreview({
  documentName,
  bodyHtml,
  company,
}: {
  documentName: string;
  bodyHtml: string;
  company: CompanySettings;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-6">
      <div
        className="mx-auto w-full max-w-[680px] rounded-sm bg-white p-8 text-[#1c1523] shadow-lg sm:p-10"
        style={{ fontFamily: "Plus Jakarta Sans, ui-sans-serif, sans-serif" }}
      >
        <div className="mb-5 flex items-start gap-3">
          {company.logoDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logoDataUrl} alt="" className="h-9 w-auto object-contain" />
          )}
          <div>
            <p className="font-display text-lg font-bold">{company.companyName || "Company Name"}</p>
            <p className="text-[11px] text-neutral-500">
              {[company.officeAddress, company.companyEmail, company.website].filter(Boolean).join("  •  ")}
            </p>
          </div>
        </div>
        <div className="h-[3px] w-full bg-[linear-gradient(90deg,#7c3aed,#7c3aed)]" />
        <p className="mt-4 text-center text-sm font-bold uppercase tracking-wide text-[#7c3aed]">
          {documentName}
        </p>

        <div
          className="preview-content mt-6 text-[13px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-3 text-[10px] text-neutral-400">
          <span>
            {company.companyName} {company.website ? `• ${company.website}` : ""}
          </span>
          <span>Page 1</span>
        </div>
      </div>
    </div>
  );
}
