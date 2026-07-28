import { DocumentTypeDefinition } from "@/types/document";
import {
  candidateNameField,
  emailField,
  phoneField,
  addressField,
  designationField,
  departmentField,
  reportingManagerField,
  workLocationField,
  joiningDateField,
  salaryField,
  noticePeriodField,
  probationMonthsField,
  probationEndDateField,
  workingDaysField,
  workingHoursField,
  employeeIdField,
  panField,
  aadhaarField,
  bankNameField,
  ifscField,
  bankAccountField,
} from "@/lib/templates/common-fields";

export const appointmentLetter: DocumentTypeDefinition = {
  id: "appointment",
  name: "Appointment Letter",
  shortName: "Appointment Letter",
  description: "Formal appointment confirmation issued on or after joining day.",
  category: "Onboarding",
  icon: "Stamp",
  available: true,
  fields: [
    candidateNameField,
    emailField,
    phoneField,
    addressField,
    employeeIdField,
    designationField,
    departmentField,
    reportingManagerField,
    workLocationField,
    joiningDateField,
    salaryField,
    noticePeriodField,
    probationMonthsField,
    probationEndDateField,
    workingDaysField,
    workingHoursField,
    panField,
    aadhaarField,
    bankNameField,
    ifscField,
    bankAccountField,
  ],
  defaultTemplate: `
<p>{{today_formatted}}</p>
<p><strong>{{candidate_name}}</strong><br/>Employee ID: {{employee_id}}<br/>{{address}}</p>
<h2>Subject: Letter of Appointment</h2>
<p>Dear {{candidate_name}},</p>
<p>We are pleased to confirm your appointment as <strong>{{designation}}</strong> in the {{department}} department of <strong>{{company_name}}</strong>, with effect from <strong>{{joining_date_formatted}}</strong>. You will be based at {{work_location}} and report to {{reporting_manager}}.</p>
<p>Your monthly gross salary will be <strong>{{salary_formatted}}</strong> ({{salary_words}}), subject to applicable statutory deductions, credited to your registered bank account.</p>
<table>
<tbody>
<tr><td><strong>Working Days</strong></td><td>{{working_days}}</td></tr>
<tr><td><strong>Working Hours</strong></td><td>{{working_hours}}</td></tr>
<tr><td><strong>Probation Period</strong></td><td>{{probation_months}} months, ending {{probation_end_date_formatted}}</td></tr>
<tr><td><strong>Notice Period</strong></td><td>{{notice_period}}</td></tr>
<tr><td><strong>PAN</strong></td><td>{{pan}}</td></tr>
<tr><td><strong>Bank Account</strong></td><td>{{bank_name}}, A/C {{bank_account}}, IFSC {{ifsc}}</td></tr>
</tbody>
</table>
<p>During your employment, you are expected to comply with all company policies, maintain confidentiality of business and client information, and devote your full working time to the company's business. This letter, along with the offer letter previously issued to you, together constitute the terms of your employment.</p>
<p>We are confident that your skills and contribution will add significant value to {{company_name}}, and we look forward to a long and productive association.</p>
<p>Warm regards,</p>
<p><strong>{{hr_name}}</strong><br/>Human Resources<br/>{{company_name}}</p>
<p>&nbsp;</p>
<p>I have read and accept the terms of this appointment letter.</p>
<p>Signature: ______________________&nbsp;&nbsp;&nbsp;&nbsp;Date: ______________________<br/>{{candidate_name}}</p>
`.trim(),
};
