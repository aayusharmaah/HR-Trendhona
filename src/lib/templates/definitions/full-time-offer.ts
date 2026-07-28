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
  employmentTypeField,
  joiningDateField,
  ctcField,
  bonusField,
  noticePeriodField,
  probationMonthsField,
  probationEndDateField,
  employeeIdField,
} from "@/lib/templates/common-fields";

export const fullTimeOfferLetter: DocumentTypeDefinition = {
  id: "full-time-offer",
  name: "Full-Time Offer Letter",
  shortName: "Full-Time Offer",
  description: "Offer a candidate a full-time position with compensation details.",
  category: "Onboarding",
  icon: "FileSignature",
  available: true,
  fields: [
    candidateNameField,
    emailField,
    phoneField,
    addressField,
    designationField,
    departmentField,
    reportingManagerField,
    workLocationField,
    employmentTypeField,
    joiningDateField,
    ctcField,
    bonusField,
    noticePeriodField,
    probationMonthsField,
    probationEndDateField,
    employeeIdField,
  ],
  defaultTemplate: `
<p>{{today_formatted}}</p>
<p><strong>{{candidate_name}}</strong><br/>{{address}}</p>
<h2>Subject: Offer of Employment</h2>
<p>Dear {{candidate_name}},</p>
<p>Further to your interview and discussions with us, we are delighted to offer you the position of <strong>{{designation}}</strong> in the {{department}} team at <strong>{{company_name}}</strong>, on a {{employment_type}} basis, based at {{work_location}}.</p>
<p>Your employee ID will be <strong>{{employee_id}}</strong> and you will report to {{reporting_manager}}. Your date of joining will be <strong>{{joining_date_formatted}}</strong>.</p>
<p>Your Annual Cost to Company (CTC) will be <strong>{{ctc_formatted}}</strong> ({{ctc_words}}), inclusive of an annual performance bonus of {{bonus_formatted}}, subject to applicable statutory deductions and company policy. A detailed salary breakup will be shared separately by the HR team.</p>
<p>You will be on probation for a period of {{probation_months}} months from your date of joining, ending on <strong>{{probation_end_date_formatted}}</strong>, during which your performance and conduct will be reviewed before confirmation. Post confirmation, the notice period applicable to your role will be {{notice_period}}.</p>
<p>This offer is contingent upon satisfactory background verification, submission of required documents, and your acceptance of the company's policies. This offer letter, along with your appointment letter, will together form the basis of your employment terms with {{company_name}}.</p>
<p>We are excited about the possibility of you joining {{company_name}} and contributing to our journey. Please confirm your acceptance by signing and returning a copy of this letter.</p>
<p>Warm regards,</p>
<p><strong>{{hr_name}}</strong><br/>Human Resources<br/>{{company_name}}</p>
<p>&nbsp;</p>
<p>I accept the above offer of employment on the terms stated.</p>
<p>Signature: ______________________&nbsp;&nbsp;&nbsp;&nbsp;Date: ______________________<br/>{{candidate_name}}</p>
`.trim(),
};
