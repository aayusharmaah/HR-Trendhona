import { DocumentTypeDefinition } from "@/types/document";
import {
  candidateNameField,
  emailField,
  phoneField,
  addressField,
  collegeField,
  courseField,
  specializationField,
  designationField,
  departmentField,
  reportingManagerField,
  workLocationField,
  joiningDateField,
  endDateField,
  internshipDurationField,
  stipendTypeField,
  stipendField,
  incentiveDetailsField,
  workingDaysField,
  workingHoursField,
} from "@/lib/templates/common-fields";

export const internshipOfferLetter: DocumentTypeDefinition = {
  id: "internship-offer",
  name: "Internship Offer Letter",
  shortName: "Internship Offer",
  description: "Offer a student or fresher an internship position.",
  category: "Onboarding",
  icon: "GraduationCap",
  available: true,
  fields: [
    candidateNameField,
    emailField,
    phoneField,
    addressField,
    collegeField,
    courseField,
    specializationField,
    designationField,
    departmentField,
    reportingManagerField,
    workLocationField,
    joiningDateField,
    endDateField,
    internshipDurationField,
    stipendTypeField,
    stipendField,
    incentiveDetailsField,
    workingDaysField,
    workingHoursField,
  ],
  defaultTemplate: `
<p>{{today_formatted}}</p>
<p><strong>{{candidate_name}}</strong><br/>{{address}}</p>
<h2>Subject: Offer of Internship</h2>
<p>Dear {{candidate_name}},</p>
<p>We are pleased to offer you an internship at <strong>{{company_name}}</strong> as a <strong>{{designation}}</strong> in the {{department}} team, based at {{work_location}}. This letter sets out the terms of your internship with us.</p>
<p>Your internship will commence on <strong>{{joining_date_formatted}}</strong> and conclude on <strong>{{end_date_formatted}}</strong>, for a total duration of <strong>{{internship_duration}}</strong>. You will report to {{reporting_manager}} through the course of this internship.</p>
<p>{{stipend_clause}}</p>
<p>Your standard working days will be {{working_days}}, and working hours will be {{working_hours}}. You may occasionally be required to extend your hours to meet project deadlines.</p>
<p>During your internship, you will be required to maintain confidentiality of all proprietary and business information you have access to, and to conduct yourself in accordance with the company's code of conduct. {{company_name}} reserves the right to extend, shorten, or discontinue the internship based on performance and business requirements, with due communication.</p>
<p>We look forward to a mutually rewarding association and wish you a great learning experience with {{company_name}}.</p>
<p>Please sign and return a copy of this letter as a token of your acceptance of the above terms.</p>
<p>Warm regards,</p>
<p><strong>{{hr_name}}</strong><br/>Human Resources<br/>{{company_name}}</p>
<p>&nbsp;</p>
<p>I accept the terms of this internship offer.</p>
<p>Signature: ______________________&nbsp;&nbsp;&nbsp;&nbsp;Date: ______________________<br/>{{candidate_name}}</p>
`.trim(),
};
