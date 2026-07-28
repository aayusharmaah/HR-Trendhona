import { DocumentTypeDefinition } from "@/types/document";
import {
  candidateNameField,
  employeeIdField,
  designationField,
  departmentField,
  joiningDateField,
  lastWorkingDateField,
  reasonField,
} from "@/lib/templates/common-fields";

export const relievingLetter: DocumentTypeDefinition = {
  id: "relieving",
  name: "Relieving Letter",
  shortName: "Relieving Letter",
  description: "Confirms an employee's last working day and clean exit.",
  category: "Offboarding",
  icon: "LogOut",
  available: true,
  fields: [
    candidateNameField,
    employeeIdField,
    designationField,
    departmentField,
    joiningDateField,
    lastWorkingDateField,
    reasonField,
  ],
  defaultTemplate: `
<p>{{today_formatted}}</p>
<h2>Subject: Relieving Letter</h2>
<p>Dear {{candidate_name}},</p>
<p>This is to confirm that you were employed with <strong>{{company_name}}</strong> as <strong>{{designation}}</strong> in the {{department}} department, from <strong>{{joining_date_formatted}}</strong> to <strong>{{last_working_date_formatted}}</strong>, bearing Employee ID {{employee_id}}.</p>
<p>Based on your resignation and the completion of your handover and exit formalities, you are hereby relieved from your duties and responsibilities at {{company_name}}, effective close of business on {{last_working_date_formatted}}.</p>
<p>We place on record our appreciation for your contribution during your tenure with us, and we confirm that all dues, if any, will be settled as per company policy. We wish you the very best in your future endeavours.</p>
<p>Please feel free to reach out to the HR team at {{company_email}} for any post-employment queries.</p>
<p>Warm regards,</p>
<p><strong>{{hr_name}}</strong><br/>Human Resources<br/>{{company_name}}</p>
`.trim(),
};
