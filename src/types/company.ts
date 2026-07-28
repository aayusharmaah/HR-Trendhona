export interface CompanySettings {
  companyName: string;
  logoDataUrl: string | null;
  stampDataUrl: string | null;
  officeAddress: string;
  gst: string;
  website: string;
  companyEmail: string;
  phone: string;
  authorizedSignatory: string;
  hrName: string;
  ceoName: string;
  defaultSalaryStructure: string;
  brandColor: string;
}

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: "Trendhona",
  logoDataUrl: null,
  stampDataUrl: null,
  officeAddress: "Ahmedabad, Gujarat, India",
  gst: "",
  website: "www.trendhona.com",
  companyEmail: "hr@trendhona.com",
  phone: "",
  authorizedSignatory: "",
  hrName: "",
  ceoName: "",
  defaultSalaryStructure: "",
  brandColor: "#7c3aed",
};
