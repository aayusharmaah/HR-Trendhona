import { FieldConfig } from "@/types/document";

export const candidateNameField: FieldConfig = {
  key: "candidate_name",
  label: "Candidate Name",
  type: "text",
  required: true,
  placeholder: "Priya Shah",
  group: "Candidate",
};

export const genderField: FieldConfig = {
  key: "gender",
  label: "Gender",
  type: "select",
  required: false,
  group: "Candidate",
  options: [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ],
};

export const emailField: FieldConfig = {
  key: "email",
  label: "Personal Email",
  type: "email",
  required: true,
  placeholder: "priya@example.com",
  group: "Candidate",
};

export const phoneField: FieldConfig = {
  key: "phone",
  label: "Phone Number",
  type: "tel",
  required: false,
  placeholder: "98765 43210",
  group: "Candidate",
};

export const addressField: FieldConfig = {
  key: "address",
  label: "Residential Address",
  type: "textarea",
  required: false,
  placeholder: "Full postal address",
  group: "Candidate",
};

export const dobField: FieldConfig = {
  key: "dob",
  label: "Date of Birth",
  type: "date",
  required: false,
  group: "Candidate",
};

export const collegeField: FieldConfig = {
  key: "college",
  label: "College / Institute",
  type: "text",
  required: false,
  placeholder: "Nirma University",
  group: "Education",
};

export const courseField: FieldConfig = {
  key: "course",
  label: "Course",
  type: "text",
  required: false,
  placeholder: "B.Tech Computer Science",
  group: "Education",
};

export const specializationField: FieldConfig = {
  key: "specialization",
  label: "Specialization",
  type: "text",
  required: false,
  placeholder: "Data Science",
  group: "Education",
};

export const designationField: FieldConfig = {
  key: "designation",
  label: "Designation",
  type: "text",
  required: true,
  placeholder: "Product Manager",
  group: "Role",
};

export const departmentField: FieldConfig = {
  key: "department",
  label: "Department",
  type: "text",
  required: false,
  placeholder: "Product & Engineering",
  group: "Role",
};

export const reportingManagerField: FieldConfig = {
  key: "reporting_manager",
  label: "Reporting Manager",
  type: "text",
  required: false,
  placeholder: "Aayush Patel",
  group: "Role",
};

export const workLocationField: FieldConfig = {
  key: "work_location",
  label: "Work Location",
  type: "text",
  required: false,
  placeholder: "Ahmedabad (Hybrid)",
  group: "Role",
};

export const employmentTypeField: FieldConfig = {
  key: "employment_type",
  label: "Employment Type",
  type: "select",
  required: false,
  group: "Role",
  options: [
    { label: "Full-Time", value: "Full-Time" },
    { label: "Part-Time", value: "Part-Time" },
    { label: "Contract", value: "Contract" },
    { label: "Internship", value: "Internship" },
  ],
};

export const joiningDateField: FieldConfig = {
  key: "joining_date",
  label: "Joining Date",
  type: "date",
  required: true,
  autoFill: "currentDate",
  group: "Dates",
};

export const endDateField: FieldConfig = {
  key: "end_date",
  label: "End Date",
  type: "date",
  required: true,
  group: "Dates",
};

export const internshipDurationField: FieldConfig = {
  key: "internship_duration",
  label: "Internship Duration",
  type: "text",
  required: false,
  autoFill: "internshipDuration",
  dependsOn: ["joining_date", "end_date"],
  group: "Dates",
  helpText: "Auto-calculated from joining and end date",
};

export const lastWorkingDateField: FieldConfig = {
  key: "last_working_date",
  label: "Last Working Date",
  type: "date",
  required: true,
  group: "Dates",
};

export const effectiveDateField: FieldConfig = {
  key: "effective_date",
  label: "Effective Date",
  type: "date",
  required: true,
  autoFill: "currentDate",
  group: "Dates",
};

export const stipendTypeField: FieldConfig = {
  key: "stipend_type",
  label: "Stipend Type",
  type: "select",
  required: false,
  group: "Compensation",
  helpText: "Choose whether the internship is paid, unpaid, or incentive-based",
  options: [
    { label: "Fixed Monthly Stipend", value: "fixed" },
    { label: "Unpaid (No Stipend)", value: "unpaid" },
    { label: "Incentive-Based Stipend", value: "incentive" },
  ],
};

export const stipendField: FieldConfig = {
  key: "stipend",
  label: "Monthly Stipend (₹)",
  type: "number",
  required: false,
  placeholder: "15000",
  group: "Compensation",
  helpText: "For a fixed stipend, the monthly amount. For incentive-based, the fixed base (leave blank if purely performance-linked). Ignored if unpaid.",
};

export const incentiveDetailsField: FieldConfig = {
  key: "incentive_details",
  label: "Incentive Structure",
  type: "textarea",
  required: false,
  placeholder: "e.g. ₹500 per qualified lead, ₹2,000 on closing each deal, capped at ₹20,000/month",
  group: "Compensation",
  helpText: "Used only for incentive-based stipends — describe how incentives are earned",
};

export const ctcField: FieldConfig = {
  key: "ctc",
  label: "Annual CTC (₹)",
  type: "number",
  required: true,
  placeholder: "600000",
  group: "Compensation",
};

export const salaryField: FieldConfig = {
  key: "salary",
  label: "Monthly Gross Salary (₹)",
  type: "number",
  required: false,
  placeholder: "50000",
  group: "Compensation",
};

export const bonusField: FieldConfig = {
  key: "bonus",
  label: "Annual Bonus (₹)",
  type: "number",
  required: false,
  placeholder: "0",
  group: "Compensation",
};

export const noticePeriodField: FieldConfig = {
  key: "notice_period",
  label: "Notice Period",
  type: "select",
  required: false,
  group: "Terms",
  options: [
    { label: "15 Days", value: "15 Days" },
    { label: "30 Days", value: "30 Days" },
    { label: "60 Days", value: "60 Days" },
    { label: "90 Days", value: "90 Days" },
  ],
};

export const probationMonthsField: FieldConfig = {
  key: "probation_months",
  label: "Probation Period (months)",
  type: "number",
  required: false,
  placeholder: "3",
  group: "Terms",
};

export const probationEndDateField: FieldConfig = {
  key: "probation_end_date",
  label: "Probation End Date",
  type: "date",
  required: false,
  autoFill: "probationEndDate",
  dependsOn: ["joining_date", "probation_months"],
  group: "Terms",
  helpText: "Auto-calculated from joining date + probation months",
};

export const workingDaysField: FieldConfig = {
  key: "working_days",
  label: "Working Days",
  type: "text",
  required: false,
  placeholder: "Monday to Friday",
  group: "Terms",
};

export const workingHoursField: FieldConfig = {
  key: "working_hours",
  label: "Working Hours",
  type: "text",
  required: false,
  placeholder: "10:00 AM – 7:00 PM",
  group: "Terms",
};

export const employeeIdField: FieldConfig = {
  key: "employee_id",
  label: "Employee ID",
  type: "text",
  required: false,
  autoFill: "employeeId",
  group: "Identifiers",
};

export const panField: FieldConfig = {
  key: "pan",
  label: "PAN Number",
  type: "text",
  required: false,
  placeholder: "ABCDE1234F",
  group: "Identifiers",
};

export const aadhaarField: FieldConfig = {
  key: "aadhaar",
  label: "Aadhaar Number",
  type: "text",
  required: false,
  placeholder: "XXXX XXXX XXXX",
  group: "Identifiers",
};

export const bankNameField: FieldConfig = {
  key: "bank_name",
  label: "Bank Name",
  type: "text",
  required: false,
  placeholder: "HDFC Bank",
  group: "Bank Details",
};

export const ifscField: FieldConfig = {
  key: "ifsc",
  label: "IFSC Code",
  type: "text",
  required: false,
  placeholder: "HDFC0001234",
  group: "Bank Details",
};

export const bankAccountField: FieldConfig = {
  key: "bank_account",
  label: "Bank Account Number",
  type: "text",
  required: false,
  placeholder: "50100XXXXXXXX",
  group: "Bank Details",
};

export const reasonField: FieldConfig = {
  key: "reason",
  label: "Reason / Remarks",
  type: "textarea",
  required: false,
  placeholder: "Brief context for this letter",
  group: "Notes",
};
