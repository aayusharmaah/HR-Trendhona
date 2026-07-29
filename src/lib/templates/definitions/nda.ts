import { DocumentTypeDefinition, FieldConfig } from "@/types/document";
import {
  candidateNameField,
  emailField,
  addressField,
  designationField,
  effectiveDateField,
} from "@/lib/templates/common-fields";

const termYearsField: FieldConfig = {
  key: "term_years",
  label: "Confidentiality Term (years)",
  type: "number",
  required: false,
  placeholder: "2",
  group: "Terms",
};

export const ndaLetter: DocumentTypeDefinition = {
  id: "nda",
  name: "Non-Disclosure Agreement",
  shortName: "NDA",
  description: "Mutual confidentiality agreement for employees, interns, or partners.",
  category: "Legal",
  icon: "ShieldCheck",
  available: true,
  fields: [
    candidateNameField,
    emailField,
    addressField,
    designationField,
    effectiveDateField,
    termYearsField,
  ],
  defaultTemplate: `
<h2 style="text-align:center">NON-DISCLOSURE AGREEMENT</h2>
<p>This Non-Disclosure Agreement ("Agreement") is entered into on <strong>{{effective_date_formatted}}</strong> ("Effective Date") between:</p>
<p><strong>{{company_name}}</strong>, having its registered office at {{office_address}} (the "Company"),</p>
<p>and</p>
<p><strong>{{candidate_name}}</strong>, engaged in the capacity of {{designation}}, residing at {{address}}, email {{email}} (the "Receiving Party").</p>
<h2>1. Purpose</h2>
<p>The Receiving Party may have access to certain confidential and proprietary information belonging to the Company in the course of their engagement, including but not limited to business plans, product designs, source code, customer data, financial information, and trade secrets ("Confidential Information").</p>
<h2>2. Obligations</h2>
<p>The Receiving Party agrees to hold all Confidential Information in strict confidence, to use it solely for the purpose of their engagement with the Company, and not to disclose it to any third party without the prior written consent of the Company.</p>
<h2>3. Term</h2>
<p>The obligations under this Agreement shall remain in effect for a period of <strong>{{term_years}} years</strong> from the Effective Date, and shall survive the termination of the Receiving Party's engagement with the Company for any reason.</p>
<h2>4. Return of Materials</h2>
<p>Upon termination of the engagement or upon request by the Company, the Receiving Party shall promptly return or destroy all documents, files, and materials containing Confidential Information.</p>
<h2>5. Governing Law</h2>
<p>This Agreement shall be governed by and construed in accordance with the laws of India, and the courts at the Company's registered office location shall have exclusive jurisdiction.</p>
<p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.</p>
<table>
<tbody>
<tr><td><strong>For {{company_name}}</strong></td><td><strong>Receiving Party</strong></td></tr>
<tr><td>Signature: ______________________</td><td>Signature: ______________________</td></tr>
<tr><td>{{authorized_signatory}}</td><td>{{candidate_name}}</td></tr>
</tbody>
</table>
`.trim(),
};
